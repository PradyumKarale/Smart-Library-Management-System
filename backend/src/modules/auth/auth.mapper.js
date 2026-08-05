/**
 * Convert database User entity to safe API response
 */
export const toSafeUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  role: user.role.roleName,

  studentProfile: user.studentProfile
    ? {
        enrollmentNo: user.studentProfile.enrollmentNo,
        department: user.studentProfile.department,
        semester: user.studentProfile.semester,
        year: user.studentProfile.year,
      }
    : null,

  librarianProfile: user.librarianProfile
    ? {
        employeeId: user.librarianProfile.employeeId,
      }
    : null,
});