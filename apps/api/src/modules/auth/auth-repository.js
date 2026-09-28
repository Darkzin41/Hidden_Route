export function createAuthRepository(database) {
  return {
    async findAdminByEmail(email) {
      const [rows] = await database.execute(
        "SELECT id, name, email, password_hash FROM admins WHERE email = ? LIMIT 1",
        [email],
      );
      if (!rows[0]) return null;
      return {
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email,
        passwordHash: rows[0].password_hash,
      };
    },
  };
}
