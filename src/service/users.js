const userRepository = require('../repository/user');
const ServiceError = require('../core/serviceError');
const { verifyPassword } = require('../core/password');
const { generateJWT, verifyJWT } = require('../core/jwt');
const { getLogger } = require('../core/logging');

  /**
   * Login a user by email + password.
   */
  const login = async (email, password) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw ServiceError.unauthorized('Invalid email or password.');
    }
    // Check password
    const passwordMatch = await verifyPassword(password, user.hashed_password);
    if (!passwordMatch) {
      throw ServiceError.unauthorized('Invalid email or password.');
    }
    return makeLoginData(user);
  };

  /**
   * Get user details by ID.
   */
  const getUserById = async (userId) => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw ServiceError.notFound(`User with id ${userId} not found.`, { userId });
    }
    return makeExposedUser(user);
  };

  /**
   * Create or register a new user.
   */
  const createUser = async (data) => {
    const inserted = await userRepository.createUser(data);
    if (!inserted) {
      throw ServiceError.notFound('User creation failed.');
    }
    return makeExposedUser(inserted);
  };

  /**
   * Build login response data (JWT + user).
   */
  const makeLoginData = async (user) => {
    const token = await generateJWT(user);
    return {
      user: makeExposedUser(user),
      token,
    };
  };

  /**
   * Expose user data to the client.
   */
  const makeExposedUser = ({
    id,
    youth_movement_id,
    role_id,
    name,
    email,
    created_at,
    updated_at,
  }) => ({
    id,
    youthMovementId: youth_movement_id,
    roleId: role_id,
    name,
    email,
    createdAt: created_at,
    updatedAt: updated_at,
  });

  const checkAndParseSession = async (authHeader) => {
    if (!authHeader) {
      throw ServiceError.unauthorized('You need to be signed in');
    } 
  
    if (!authHeader.startsWith('Bearer ')) {
      throw ServiceError.unauthorized('Invalid authentication token');
    }
    const authToken = authHeader.substring(7);
    try {
      const { userid, roles } = await verifyJWT(authToken);
  
  
      return {
        userid,
        roles,
        authToken,
      };
    } catch (error) {
      getLogger().error(error.message, { error });
      throw new Error(error.message);
    }
  };
  const checkRole = (roles, role) => {
    if (!roles.includes(role)) {
      throw ServiceError.forbidden('You do not have the required role');
    }
  };
  module.exports = {
    login,
    checkAndParseSession,
    getUserById,
    checkRole,
  }