import Groq from "groq-sdk";
import config from "../../config/config.js";
import { findAllBooks } from "../books/book.repository.js";
import { findAllCategories } from "../categories/category.repository.js";

// Bounded catalog context builder
const getCatalogContext = async () => {
  const [books, categories] = await Promise.all([
    findAllBooks({ isActive: true }),
    findAllCategories(),
  ]);

  const categoryList = categories.map((c) => `- [ID ${c.id}] ${c.name}: ${c.description || "General collection"}`).join("\n");

  const bookList = books.map((b) => {
    return `- "${b.title}" by ${b.author} | Category: ${b.category?.name || "Uncategorized"} | ISBN: ${b.isbn} | Copies: ${b.availableCopies}/${b.totalCopies} available | Shelf: ${b.shelfLocation || "N/A"}`;
  }).join("\n");

  return { books, categories, categoryList, bookList };
};

// Filter catalog books relevant to user query for card display
const findRelevantBooks = (books, query) => {
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/).filter((t) => t.length > 2);

  return books.filter((b) => {
    const title = b.title.toLowerCase();
    const author = b.author.toLowerCase();
    const cat = (b.category?.name || "").toLowerCase();

    // Direct match
    if (title.includes(q) || author.includes(q) || cat.includes(q)) return true;

    // Token match
    const matchCount = tokens.filter(
      (t) => title.includes(t) || author.includes(t) || cat.includes(t)
    ).length;

    return matchCount > 0;
  }).slice(0, 5);
};

export const chatWithAssistantService = async ({ user, message, history = [] }) => {
  const { books, categoryList, bookList } = await getCatalogContext();
  const relevantBooks = findRelevantBooks(books, message);

  // If Groq API Key is not configured, provide a rich, grounded catalog response
  if (!config.groqApiKey) {
    const matchedNames = relevantBooks.map((b) => `• **${b.title}** by ${b.author} (${b.availableCopies > 0 ? `${b.availableCopies} available` : "currently checked out"})`).join("\n");

    let reply = "";
    if (message.toLowerCase().includes("rule") || message.toLowerCase().includes("borrow") || message.toLowerCase().includes("fine") || message.toLowerCase().includes("period")) {
      reply = `### Smart Library Borrowing Policies\n\n` +
        `• **Loan Period:** 14 days per checkout.\n` +
        `• **Maximum Active Loans:** Students may borrow up to 3 books simultaneously.\n` +
        `• **Overdue Fines:** ₹5/day after the due date.\n` +
        `• **Returns:** Present your book to an authorized librarian to clear your record.\n\n` +
        `*(Note: Full generative conversation requires \`GROQ_API_KEY\` in your environment. Catalog search and rules are verified.)*`;
    } else if (relevantBooks.length > 0) {
      reply = `Here are the matching books from our current library collection:\n\n${matchedNames}\n\n` +
        `You can find more details in the Books catalog or request an issue from your librarian.\n\n` +
        `*(Notice: To enable generative natural language conversations with Groq Cloud, provide \`GROQ_API_KEY\` in your environment variables.)*`;
    } else {
      reply = `I searched our verified library catalog but couldn't find an exact match for "${message}".\n\n` +
        `We have books across Computer Science, Artificial Intelligence, Database Systems, and Algorithms.\n\n` +
        `Try searching for "Clean Code", "Algorithms", "Deep Learning", or asking "What are the borrowing rules?".\n\n` +
        `*(Notice: To enable generative AI reasoning with Groq Cloud, set \`GROQ_API_KEY\` in your environment.)*`;
    }

    return {
      reply,
      model: "catalog-grounded-fallback",
      provider: "groq-fallback",
      matchedBooks: relevantBooks,
    };
  }

  // Construct Groq client
  const groq = new Groq({ apiKey: config.groqApiKey });

  const roleName = user.role?.roleName || user.role || "STUDENT";
  const userProfile = user.studentProfile
    ? `Student (Dept: ${user.studentProfile.department || "N/A"}, Year: ${user.studentProfile.year || "N/A"})`
    : roleName;

  const systemPrompt = `You are the official Smart Library Management System (SLMS) AI Assistant.
Your mission is to help students, librarians, and faculty discover books, navigate the library catalog, and understand borrowing policies.

CURRENT USER CONTEXT:
- Name: ${user.fullName}
- Role: ${roleName}
- Profile: ${userProfile}

VERIFIED LIBRARY POLICIES:
- Standard Loan Period: 14 days
- Max Active Loans: 3 books per student at any one time
- Overdue Policy: Overdue books block new checkouts and incur daily fines
- Returns: Must be processed by an authorized Librarian or Administrator

REAL CATALOG INVENTORY (GROUND TRUTH):
Categories:
${categoryList}

Books:
${bookList}

STRICT GUIDELINES:
1. ONLY recommend books that genuinely exist in the catalog list above. Do NOT hallucinate books, authors, or ISBNs.
2. If a user asks for books on a topic we have in the catalog, explain clearly why our catalog book fits their need.
3. If a book has 0 available copies, clearly mention that it is currently checked out by other readers.
4. If a book is not in our catalog, honestly explain that it is not currently in stock and suggest closest alternatives from our real inventory.
5. Respect the user role: Students only see their own context and public catalog. Never fabricate private borrower records.
6. The assistant is read-only: never claim you have checked out, returned, or renewed a book for the user. Direct them to the Issues page or a librarian.
7. Format responses using clean markdown (bullet points, bold titles). Keep answers friendly, concise, and helpful.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-6).map((h) => ({
      role: h.role,
      content: h.content,
    })),
    { role: "user", content: message },
  ];

  try {
    const completion = await groq.chat.completions.create({
      model: config.groqModel || "llama-3.3-70b-versatile",
      messages,
      temperature: 0.5,
      max_tokens: 800,
    });

    const reply = completion.choices[0]?.message?.content || "I apologize, but I could not generate a response.";

    return {
      reply,
      model: completion.model || config.groqModel,
      provider: "groq",
      matchedBooks: relevantBooks,
    };
  } catch (error) {
    console.error("[Groq AI Service Error]:", error);

    // Handle Rate limits (HTTP 429) gracefully
    if (error?.status === 429 || error?.message?.includes("rate_limit") || error?.message?.includes("Rate limit")) {
      return {
        reply: "⚠️ **Groq AI Rate Limit Reached**\n\nThe Groq free developer tier usage limit has been momentarily reached. Please wait a brief moment before sending another request.\n\nIn the meantime, the library catalog and all core features (Books, Issues, Categories) remain fully functional.",
        model: config.groqModel,
        provider: "groq",
        isRateLimited: true,
        matchedBooks: relevantBooks,
      };
    }

    // Handle Authentication / Invalid Key
    if (error?.status === 401 || error?.message?.includes("Invalid API Key")) {
      return {
        reply: "⚠️ **Invalid Groq API Key**\n\nThe configured `GROQ_API_KEY` was rejected by Groq Cloud. Please check your credentials in the server environment.\n\nStandard library catalog search and browsing continue to work normally.",
        model: config.groqModel,
        provider: "groq",
        matchedBooks: relevantBooks,
      };
    }

    // Handle Model not found or deprecated
    if (error?.status === 404 || error?.message?.includes("model")) {
      return {
        reply: `⚠️ **Groq Model Unavailable**\n\nThe configured model (\`${config.groqModel}\`) could not be loaded. Please ensure \`GROQ_MODEL\` is set to an active Groq model such as \`llama-3.3-70b-versatile\` or \`llama-3.1-8b-instant\`.`,
        model: config.groqModel,
        provider: "groq",
        matchedBooks: relevantBooks,
      };
    }

    // Other network / provider issues
    return {
      reply: `⚠️ **AI Service Unavailable**\n\nCould not reach Groq Cloud AI: ${error.message || "Network timeout"}.\nPlease retry in a few moments. All standard library operations remain available.`,
      model: config.groqModel,
      provider: "groq",
      matchedBooks: relevantBooks,
    };
  }
};
