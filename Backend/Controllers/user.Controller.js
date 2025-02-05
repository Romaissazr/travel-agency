const User = require('../Models/user.Model');
const Booking = require('../Models/booking.Model'); 
const Tour = require('../Models/tour.Model'); 

const Review = require('../Models/review.Model'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

// Register Controller
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

      
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }

       
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: false, message: "Email already registered" });
        }

       
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ firstName, lastName, email, password: hashPassword });
        await newUser.save();

        return res.status(201).json({ status: true, message: "Register successful" });
    } catch (error) {
        console.error("Error in register:", error.message);
        return res.status(400).json({ status: false, message: "Something went wrong", error: error.message });
    }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

  
    if (!email || !password) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

  
    const user = await User.findOne({ email });

   
    if (!user) {
      return res.status(400).json({ status: false, message: "Email is incorrect" });
    }

   
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ status: false, message: "Password is incorrect" });
    }

    if (!user.verified) {
      return res.status(403).json({ status: false, message: "Account is not verified" });
    }

    // Generate a JWT token with all user information, including the `verified` field
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        dateBirth: user.dateBirth,
        address: user.address,
        phone: user.phone,
        avatar: user.avatar,
        verified: user.verified, 
      },
      secretKey,
      { expiresIn: "2h" } 
    );

  
    return res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        dateBirth: user.dateBirth,
        address: user.address,
        phone: user.phone,
        avatar: user.avatar,
        verified: user.verified, 
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// Profile Controller
const profile = async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: "Access Denied" });
        }

        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                return res.status(400).json({ status: false, message: "Invalid Token" });
            }

          
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(400).json({ status: false, message: "User not found" });
            }

   
            const userData = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                address: user.address,
                avatar: user.avatar,
                dateBirth: user.dateBirth,
            };

            return res.status(200).json({ status: true, message: "Profile Data", data: userData });
        });
    } catch (error) {
        console.error("Error in profile:", error.message);
        return res.status(400).json({ status: false, message: "Something went wrong", error: error.message });
    }
};

// Update User Controller
const updateUser = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ status: false, message: "Access Denied" });
    }

    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ status: false, message: "Invalid Token" });
      }

      const { firstName, lastName, phone, address, dateBirth } = req.body;

      let avatarPath = null;
      if (req.file) {
        avatarPath = `/uploads/${req.file.filename}`;
      }

      const updatedUser = await User.findByIdAndUpdate(
        decoded.id,
        {
          firstName,
          lastName,
          phone,
          address,
          dateBirth,
          ...(avatarPath && { avatar: avatarPath }),
        },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ status: false, message: "User not found." });
      }

      return res.status(200).json({
        status: true,
        message: "User updated successfully.",
        data: updatedUser,
      });
    });
  } catch (error) {
    console.error("Error in updateUser:", error.message);
    return res.status(500).json({ status: false, message: "Something went wrong.", error: error.message });
  }
};

// Update Password Controller
const updatePassword = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ status: false, message: "Access Denied" });
    }

    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ status: false, message: "Invalid Token" });
      }

      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ status: false, message: "Both old and new passwords are required." });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found." });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ status: false, message: "Old password is incorrect." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({ status: true, message: "Password updated successfully." });
    });
  } catch (error) {
    console.error("Error in updatePassword:", error.message);
    return res.status(500).json({ status: false, message: "Something went wrong.", error: error.message });
  }
};

// Update Email Controller
const updateEmail = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ status: false, message: "Access Denied" });
    }

    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ status: false, message: "Invalid Token" });
      }

      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ status: false, message: "Email is required." });
      }

      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ status: false, message: "Email is already in use." });
      }

      const updatedUser = await User.findByIdAndUpdate(
        decoded.id,
        { email },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ status: false, message: "User not found." });
      }

      return res.status(200).json({
        status: true,
        message: "Email updated successfully.",
        data: updatedUser,
      });
    });
  } catch (error) {
    console.error("Error in updateEmail:", error.message);
    return res.status(500).json({ status: false, message: "Something went wrong.", error: error.message });
  }
};

// Search Email Controller
const searchEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ status: false, message: "Email is required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: false, message: "Email not found." });
    }

    return res.status(200).json({ status: true, message: "Email found.", data: { email: user.email } });
  } catch (error) {
    console.error("Error in searchEmail:", error.message);
    return res.status(500).json({ status: false, message: "Something went wrong.", error: error.message });
  }
};

// Get User by ID Controller
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details.", error: error.message });
  }
};

// Get All Users Controller
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords from the response
    res.status(200).json({ status: true, message: "Users fetched successfully.", data: users });
  } catch (error) {
    console.error("Error in getAllUsers:", error.message);
    res.status(500).json({ status: false, message: "Something went wrong.", error: error.message });
  }
};

// Update User Role Controller
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ status: false, message: "Role is required." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "User not found." });
    }

    return res.status(200).json({
      status: true,
      message: "User role updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUserRole:", error.message);
    return res.status(500).json({ status: false, message: "Something went wrong.", error: error.message });
  }
};

// Delete User Controller
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const userBookings = await Booking.find({ user: userId });

  
    for (const booking of userBookings) {
      const tour = await Tour.findById(booking.tour);

      if (tour) {
        
        tour.availableSlots += booking.groupSize;

       
        if (tour.availableSlots > 0 && tour.status === "fully booked") {
          tour.status = "active"; 
        }

       
        await tour.save();
      }
    }

    const deletedBookings = await Booking.deleteMany({ user: userId });


    const userReviews = await Review.find({ user: userId });

 
    const deletedReviews = await Review.deleteMany({ user: userId });

 
    for (const review of userReviews) {
      const tour = await Tour.findById(review.tour);

      if (tour) {
   
        const reviews = await Review.find({ tour: tour._id });
        const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? totalRatings / reviews.length : 0;

     
        tour.rating = averageRating;
        await tour.save();
      }
    }

   
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ status: false, message: "User not found." });
    }

    return res.status(200).json({
      status: true,
      message: "User, associated bookings, and reviews deleted successfully. Available slots and ratings updated.",
      data: {
        user: deletedUser,
        bookings: deletedBookings,
        reviews: deletedReviews,
      },
    });
  } catch (error) {
    console.error("Error in deleteUser:", error.message);
    return res.status(500).json({ status: false, message: "Something went wrong.", error: error.message });
  }
};

module.exports = {
  register,
  login,
  profile,
  updateUser,
  updatePassword,
  updateEmail,
  searchEmail,
  getUserById,
  getAllUsers,
  updateUserRole,
  deleteUser,
};