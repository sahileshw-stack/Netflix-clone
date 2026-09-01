const MyList = require("../Models/MyList");
const User = require("../Models/User");
const {
    decryptEmail,
} = require("../Utils/emailCrypto");


const getAdminWishlist = async (req, res) => {
    try {

        const items = await MyList.find({})
            .populate("movieId")
            .sort({
                createdAt: -1,
            });


        const wishlist = [];


        for (const item of items) {

            const user = await User.findById(
                item.userId
            );


            if (!user) {
                continue;
            }


            /*
              Find the profile that owns
              this My List item
            */

            const profile =
                user.profiles?.find(
                    (profile) =>
                        String(profile._id) ===
                        String(item.profileId)
                );


            wishlist.push({
                _id: item._id,

                userId: user._id,

                userName:
                    user.profiles?.[0]?.name ||
                    "User",

                email:
                    user.email
                        ? decryptEmail(user.email)
                        : "",

                profileId:
                    item.profileId,

                profileName:
                    profile?.name ||
                    "Profile",

                movieId:
                    item.movieId?._id ||
                    item.movieId,

                movieTitle:
                    item.title,

                genre:
                    item.genre,

                image:
                    item.image,

                addedDate:
                    item.createdAt,
            });
        }


        return res.status(200).json({
            success: true,

            total:
                wishlist.length,

            wishlist,
        });


    } catch (error) {

        console.error(
            "Admin wishlist error:",
            error
        );


        return res.status(500).json({
            success: false,

            message:
                "Unable to get wishlist",

            error:
                error.message,
        });
    }
};
const deleteWishlistItem = async (req, res) => {
    try {
        const { id } = req.params;

        const item =
            await MyList.findById(id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message:
                    "Wishlist item not found",
            });
        }

        await MyList.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message:
                "Wishlist item removed successfully",
            id,
        });

    } catch (error) {
        console.error(
            "Delete wishlist item error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to remove wishlist item",
            error:
                error.message,
        });
    }
};


module.exports = {
    getAdminWishlist,
    deleteWishlistItem,
};