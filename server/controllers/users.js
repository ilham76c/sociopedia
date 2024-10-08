import User from '../models/User.js';

/* READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
};

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
    
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
    
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);   
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
};


/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        const params = req.params;
        const user = await User.findById(params.id);
        const friend = await User.findById(params.friendId);

        if (user.friends.includes(params.friendId)) {
            user.friends = user.friends.filter((id) => id !== params.friendId);
            friend.friends = friend.friends.filter((id) => id !== params.id);
        } else {
            user.friends.push(params.friendId);
            friend.friends.push(params.id);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
    
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
};