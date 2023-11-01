import { asyncHandler } from "../Utils/AsyncHandler";
import { Request, Response } from "express";
import User from "../Models/user_modal";
import { ApiError } from "../Utils/ApiError";
import { UserRolesEnum } from "../../Constants";
import { ApiResponse } from "../Utils/ApiResponse";
import { sendEmail } from "../Utils/mail";
import { emailVerificationMailgenContent } from "../Utils/mail";

interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  role: string;
}

const registerUser = asyncHandler(
  async (req: Request<{}, RegisterRequest>, res: Response<RegisterRequest>) => {
    const { email, username, password, role }: RegisterRequest = req.body;

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existedUser) {
      throw new ApiError(409, "User with email or username already exists", []);
    }
    const user = await User.create({
      email,
      password,
      username,
      isEmailVerified: false,
      role: role || UserRolesEnum.USER,
    });

    /**
     * unHashedToken: unHashed token is something we will send to the user's mail
     * hashedToken: we will keep record of hashedToken to validate the unHashedToken in verify email controller
     * tokenExpiry: Expiry to be checked before validating the incoming token
     */

    const { unHashedToken, hashedToken, tokenExpiry }: any =
      user.generateTemporaryToken();

    /**
     * assign hashedToken and tokenExpiry in DB till user clicks on email verification link
     * The email verification is handled by {@link verifyEmail}
     */
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: user.email,
      subject: "Please verify your email",
      mailgenContent: emailVerificationMailgenContent(
        user.username,
        `${req.protocol}://${req.get(
          "host"
        )}/api/v1/users/verify-email/${unHashedToken}`
      ),
    });
    console.log(user.email);

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          { user: createdUser },
          "Users registered successfully and verification email has been sent on your email."
        )
      );
  }
);

export { registerUser };
