import Story from "../database/Models/edstory";

// Delete Edstory
export const deleteStory = async (storyId) => {
	try {
		await Story.findByIdAndRemove(storyId);
	} catch (err) {
		throw err;
	}
};
