// const StudentDetails = require("../model/studentDetails.model");
// const mongoose = require('mongoose'); // Make sure to import mongoose

// const uploadFamilyDetails = async (req, res) => {
//   try {
//     const { userId, familyDetails } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: 'userId is required' });
//     }

//     if (Object.keys(familyDetails).length === 0) {
//       return res.status(400).json({ message: 'Family data is required' });
//     }

//     // Create familyMembers key inside familyDetails
//     const updatedFamilyDetails = {
//       familyMembers: familyDetails // Move existing familyDetails data under familyMembers
//     };

//     // Find and update or create a new record
//     const result = await StudentDetails.findOneAndUpdate(
//       { userId },
//       { $set: { familyDetails: updatedFamilyDetails } },
//       { new: true, upsert: true }
//     );

//     res.status(201).json({ message: 'Family details saved successfully!', data: result });
//   } catch (error) {
//     console.error('Error saving family details:', error); // Log error details
//     res.status(500).json({ message: 'Error saving family details', error: error.message });
//   }
// };
// const getFamilyDetails = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: 'userId is required' });
//     }

//     const result = await StudentDetails.findOne({ userId: { $regex: `^${userId}$`, $options: 'i' } });

//     if (!result) {
//       return res.status(200).json({ message: 'No family details found for the provided userId', status: false });
//     }

//     res.status(200).json({ message: 'Family details retrieved successfully', data: result, status: true });
//   } catch (error) {
//     console.error('Error retrieving family details:', error);
//     res.status(500).json({ message: 'Error retrieving family details', error: error.message });
//   }
// };

// const setMonthlyBudget = async (req, res) => {
//   try {
//     const { userId, budget, allocations } = req.body;

//     // Validate input
//     if (!userId) {
//       return res.status(400).json({ message: 'userId is required' });
//     }

//     if (!budget || isNaN(budget)) {
//       return res.status(400).json({ message: 'A valid budget is required' });
//     }

//     // Create an update object
//     const update = {
//       $set: {
//         "familyDetails.budget": budget, // Update the budget
//       },
//     };

//     // Iterate through allocations to update each family member's allocatedBudget
//     for (const memberKey in allocations) {
//       if (allocations.hasOwnProperty(memberKey)) {
//         update.$set[`familyDetails.familyMembers.${memberKey}.allocatedBudget`] = allocations[memberKey];
//       }
//     }

//     // Find the user and update the budget and family members' allocated budgets
//     const result = await StudentDetails.findOneAndUpdate(
//       { userId },
//       update,
//       { new: true, upsert: true }
//     );

//     res.status(200).json({ message: 'Budget and allocations updated successfully', data: result, status: true });
//   } catch (error) {
//     console.error('Error setting budget:', error); // Log error details
//     res.status(500).json({ message: 'Error setting budget', error: error.message });
//   }
// };
// const updateNutritionRequirement = async (req, res) => {
//   try {
//     const { userId, nutritionRequirement } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: 'userId is required' });
//     }

//     if (typeof nutritionRequirement !== 'object' || Object.keys(nutritionRequirement).length === 0) {
//       return res.status(400).json({ message: 'A valid nutritionRequirement is required' });
//     }

//     // Find the user and update the nutritionRequirement
//     const result = await StudentDetails.findOneAndUpdate(
//       { userId },
//       { $set: { "familyDetails.nutritionRequirement": nutritionRequirement } }, // Update the nutritionRequirement field
//       { new: true, upsert: true }
//     );

//     res.status(200).json({ message: 'Nutrition requirements updated successfully', data: result, status: true });
//   } catch (error) {
//     console.error('Error updating nutrition requirements:', error); // Log error details
//     res.status(500).json({ message: 'Error updating nutrition requirements', error: error.message });
//   }
// };
// const updatePurchaseDetails = async (req, res) => {
//   try {
//     const { userId, wishListDetails,userRole } = req.body;
//     console.log(userId, wishListDetails, "check data");

//     // Validate input
//     if (!userId) {
//       return res.status(400).json({ message: 'userId is required' });
//     }

//     if (!wishListDetails || !Array.isArray(wishListDetails)) {
//       return res.status(400).json({ message: 'Valid wishListDetails are required' });
//     }
//     const user = await StudentDetails.findOne({ userId });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const currentTotalFundUsed = user.familyDetails?.totalFundUsed || 0;
//     const totalPurchaseCost = wishListDetails.reduce((total, item) => {
//       const price = Number(item.price) || 0;
//       const quantity = Number(item.quantity) || 0;
//       return total + (price * quantity);
//     }, 0);

//     const nutrientUpdates = {};

//     // Calculate nutrients consumed from each wishListDetail
//     wishListDetails.forEach(item => {
//       if (item.nutrients) {
//         Object.entries(item.nutrients).forEach(([key, value]) => {
//           nutrientUpdates[key] = (nutrientUpdates[key] || 0) + Number(value);
//         });
//       }
//     });
//     const familyMemberField = `familyDetails.familyMembers.${userRole}.allocatedBudget`;
//     const currentAllocatedBudget = user.familyDetails?.familyMembers?.[userRole]?.allocatedBudget || 0;

//     // Update the shopping wishListDetails and totalFundUsed
//     const updateObject = {
//       $push: { 'shopping.wishListDetails': { $each: wishListDetails } }, // Push new wishlist details
//       $set: {
//         'familyDetails.totalFundUsed': currentTotalFundUsed + totalPurchaseCost,
//         [familyMemberField]: currentAllocatedBudget - totalPurchaseCost, // Deduct from allocatedBudget
//       },
//     };

//     // Update nutrients consumed if any
//     if (Object.keys(nutrientUpdates).length > 0) {
//       const existingNutrients = user.familyDetails?.nutrientsConsumed || {};

//       // Merge new nutrient updates with existing ones
//       for (const [key, value] of Object.entries(nutrientUpdates)) {
//         existingNutrients[key] = (existingNutrients[key] || 0) + value; // Increment if exists, otherwise set
//       }

//       updateObject.$set['familyDetails.nutrientsConsumed'] = existingNutrients; // Set updated nutrients
//     }

//     const result = await StudentDetails.findOneAndUpdate(
//       { userId },
//       updateObject,
//       { new: true }
//     );

//     res.status(200).json({ message: 'Wishlist details updated successfully', data: result, status: true });
//   } catch (error) {
//     console.error('Error updating wishlist details:', error);
//     res.status(500).json({ message: 'Error updating wishlist details', error: error.message });
//   }
// };
// const updateAtHomeFamilyMembersDetails = async (req, res) => {
//   try {
//     const { userId, familyMembers, allMembersTogether } = req.body;

//     console.log(familyMembers);
//     if (!userId) {
//       return res.status(400).json({ message: 'userId is required' });
//     }

//     if (!familyMembers || typeof familyMembers !== 'object' || Object.keys(familyMembers).length === 0) {
//       return res.status(400).json({ message: 'Valid familyMembers data is required' });
//     }

//     const update = {
//       $set: {
//         "familyDetails.allMembersTogether": allMembersTogether,
//       },
//     };

//     // Loop through each family member to update atHome and isPlaying status
//     for (const memberKey in familyMembers) {
//       if (familyMembers.hasOwnProperty(memberKey)) {
//         const isPlaying = familyMembers[memberKey].isPlaying;
        
//         // Set atHome to true if isPlaying is false
//         const atHome = isPlaying ? familyMembers[memberKey].atHome : true;

//         update.$set[`familyDetails.familyMembers.${memberKey}.atHome`] = atHome;
//         update.$set[`familyDetails.familyMembers.${memberKey}.isPlaying`] = isPlaying;
//       }
//     }

//     // Update the database
//     const result = await StudentDetails.findOneAndUpdate(
//       { userId },
//       update,
//       { new: true, upsert: true }
//     );

//     res.status(200).json({
//       message: 'Family members availability and playing status updated successfully',
//       data: result,
//       status: true,
//     });
//   } catch (error) {
//     console.error('Error updating family members availability:', error);
//     res.status(500).json({ message: 'Error updating family members availability', error: error.message });
//   }
// };



// const createPollDetails = async (req, res) => {
//   try {
//     const { userId, pollDetails } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: 'userId is required' });
//     }

//     if (!pollDetails || typeof pollDetails !== 'object' || Object.keys(pollDetails).length === 0) {
//       return res.status(400).json({ message: 'Valid pollDetails data is required' });
//     }



//     const uniquePollId = new mongoose.Types.ObjectId();

//     const pollWithId = { ...pollDetails, pollId: uniquePollId, pollEnded: false };

//     const update = {
//       $push: {
//         [`pollDetails`]: pollWithId,
//       },
//     };

//     const result = await StudentDetails.findOneAndUpdate(
//       { userId },
//       update,
//       { new: true, upsert: true } // `upsert` will create the document if it doesn't exist
//     );

//     res.status(200).json({
//       message: ` poll details updated successfully`,
//       data: result,
//       status: true,
//       uniquePollId: uniquePollId
//     });
//   } catch (error) {
//     console.error('Error updating poll details:', error);
//     res.status(500).json({
//       message: 'Error updating poll details',
//       error: error.message,
//     });
//   }
// };
// const updatePollDetails = async (req, res) => {
//   try {
//     const { userId, pollId, vote, voterRole } = req.body;

//     // Validation for required fields
//     if (!userId) {
//       return res.status(400).json({ message: 'userId is required' });
//     }

//     if (!pollId) {
//       return res.status(400).json({ message: 'pollId is required' });
//     }

//     if (!["yes", "no"].includes(vote.toLowerCase())) {
//       return res.status(400).json({ message: 'Vote must be either "Yes" or "No"' });
//     }

//     if (!voterRole) {
//       return res.status(400).json({ message: 'Voter role is required (e.g., dad, mom, etc.)' });
//     }

//     const user = await StudentDetails.findOne({ userId });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const familyMembersCount = Object.keys(user.familyDetails.familyMembers).length;

//     const poll = await StudentDetails.findOne({ userId });
//     if (!poll) {
//       return res.status(404).json({ message: 'Poll not found' });
//     }

//     const pollToUpdate = poll.pollDetails.find((p) => p.pollId.toString() === pollId);
//     if (!pollToUpdate) {
//       return res.status(404).json({ message: 'Poll not found in poll details' });
//     }

//     if (pollToUpdate.pollEnded) {
//       return res.status(400).json({ message: 'This poll has already ended' });
//     }

//     pollToUpdate.votes = pollToUpdate.votes || {};
//     console.log('Before Voting:', pollToUpdate); // Debugging line


//     pollToUpdate.votes[voterRole] = vote.charAt(0).toUpperCase() + vote.slice(1).toLowerCase();

//     console.log(pollToUpdate, "before total votes");

//     // Check if the poll should be ended
//     const totalVotes = Object.keys(pollToUpdate.votes).length;
//     if (totalVotes >= familyMembersCount) {
//       pollToUpdate.pollEnded = true;
//     }

//     // Update the pollDetails array with the modified poll
//     const update = {
//       $set: {
//         [`pollDetails.$[poll].votes`]: pollToUpdate.votes, // Update the votes object directly
//         [`pollDetails.$[poll].pollEnded`]: pollToUpdate.pollEnded, // Update pollEnded status
//       },
//     };

//     console.log(update, "update");
//     const options = {
//       new: true,
//       arrayFilters: [{ "poll.pollId": new mongoose.Types.ObjectId(pollId) }], // Ensure ObjectId type
//     };

//     console.log(options, "options");

//     // Attempting to update the poll in the database
//     const result = await StudentDetails.findOneAndUpdate(
//       { userId },
//       update,
//       options
//     );

//     if (!result) {
//       return res.status(500).json({ message: 'Failed to update poll details' });
//     }

//     // Fetching the updated poll details to return
//     const updatedPoll = result.pollDetails.find((p) => p.pollId.toString() === pollId);
//     console.log('After Voting:', updatedPoll); // Debugging line

//     res.status(200).json({
//       message: `Vote recorded successfully for poll with ID ${pollId}`,
//       data: updatedPoll, // Return the updated poll details
//       status: true,
//       userDetails: result
//     });
//   } catch (error) {
//     console.error('Error updating poll details:', error);
//     res.status(500).json({
//       message: 'Error updating poll details',
//       error: error.message,
//     });
//   }
// };

// const createVetoDetails = async (req, res) => {
//   try {
//     const { userId, pollDetails } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: 'userId is required' });
//     }

//     if (!pollDetails || typeof pollDetails !== 'object' || Object.keys(pollDetails).length === 0) {
//       return res.status(400).json({ message: 'Valid pollDetails data is required' });
//     }



//     const uniquePollId = new mongoose.Types.ObjectId();

//     const pollWithId = { ...pollDetails, pollId: uniquePollId, pollEnded: false };

//     const update = {
//       $push: {
//         [`pollDetails`]: pollWithId,
//       },
//     };

//     const result = await StudentDetails.findOneAndUpdate(
//       { userId },
//       update,
//       { new: true, upsert: true } // `upsert` will create the document if it doesn't exist
//     );

//     res.status(200).json({
//       message: ` poll details updated successfully`,
//       data: result,
//       status: true,
//       uniquePollId: uniquePollId
//     });
//   } catch (error) {
//     console.error('Error updating poll details:', error);
//     res.status(500).json({
//       message: 'Error updating poll details',
//       error: error.message,
//     });
//   }
// };

// const updateRandomEvents = async (req, res) => {
//   try {
//     const { userId, randomEventsTriggered } = req.body;
//     console.log(userId, randomEventsTriggered, "check data");

//     if (!userId) {
//       return res.status(400).json({ message: 'userId is required' });
//     }

//     // Create an update object
//     const updateObject = {
//       $addToSet: { 'shopping.randomEventsTriggered': randomEventsTriggered }
//     };

//     // If it's a string, wrap it in an array to use the $each operator
//     if (typeof randomEventsTriggered === 'string') {
//       updateObject.$addToSet['shopping.randomEventsTriggered'] = randomEventsTriggered;
//     } else if (Array.isArray(randomEventsTriggered)) {
//       // If it's an array, use $each to add all elements uniquely
//       updateObject.$addToSet['shopping.randomEventsTriggered'] = { $each: randomEventsTriggered };
//     } else {
//       return res.status(400).json({ message: 'Valid randomEventsTriggered is required (string or array)' });
//     }

//     // Perform the database update
//     await StudentDetails.findOneAndUpdate(
//       { userId },
//       updateObject,
//       { new: true }
//     );

//     res.status(200).json({ message: 'Random events updated successfully', status: true });
//   } catch (error) {
//     console.error('Error updating random events:', error);
//     res.status(500).json({ message: 'Error updating random events', error: error.message });
//   }
// };
// const updateFundUsed = async (req, res) => {

//   try {
//     const { userId, fundUpdate } = req.body;
//     const user = await StudentDetails.findOne({ userId });

//     console.log(userId,fundUpdate)
//     const currentTotalFundUsed = user.familyDetails?.totalFundUsed || 0;
//     const updateObject = {
//       $set: {
//         'familyDetails.totalFundUsed': currentTotalFundUsed + fundUpdate,
//       },
//     };
//     const result = await StudentDetails.findOneAndUpdate(
//       { userId },
//       updateObject,
//       { new: true }
//     );

//     res.status(200).json({ message: 'Wishlist details updated successfully', data: result, status: true });
//   } catch (error) {
//     console.error('Error updating wishlist details:', error);
//     res.status(500).json({ message: 'Error updating wishlist details', error: error.message });
//   }
// }
// const uploadSelectedNutrients = async (req, res) => {
//   try {
//     const { userId, selectedNutrients, userRole } = req.body;
//     if (!userId) {
//       return res.status(400).json({ message: 'userId is required' });
//     }
//     if (!Array.isArray(selectedNutrients)) {
//       return res.status(400).json({ message: 'A valid array of selected nutrients is required' });
//     }
//     const update = {
//       $set: {
//         [`familyDetails.familyMembers.${userRole}.selectedNutrients`]: selectedNutrients // Update selected nutrients for the matching role
//       },
//     };
//     const result = await StudentDetails.findOneAndUpdate(
//       { userId },
//       update,
//       { new: true, upsert: true }
//     );
//     if (!result) {
//       return res.status(404).json({ message: 'User not found or update failed.' });
//     }

//     res.status(200).json({ message: 'Selected nutrients updated successfully', data: result, status: true });
//   } catch (error) {
//     console.error('Error uploading selected nutrients:', error); // Log error details
//     res.status(500).json({ message: 'Error uploading selected nutrients', error: error.message });
//   }
// };


// const updateShoppingMessage = async (req, res) => {
//   try {
//     const { userId, message,userRole } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: 'userId is required' });
//     }
//     if (!message || typeof message !== 'string') {
//       return res.status(400).json({ message: 'A valid message is required' });
//     }
//     const user = await StudentDetails.findOne({ userId });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const id = new mongoose.Types.ObjectId();
//     const updatedMessage = {
//       _id: id, 
//       message: message,
//       userRole: userRole, 
//       timestamp: new Date(), 
//     };
//     const updateObject = {
//       $push: { 'shopping.messages': updatedMessage }, 
//     };
//     const result = await StudentDetails.findOneAndUpdate(
//       { userId },
//       updateObject,
//       { new: true }
//     );
//     res.status(200).json({ message: 'Message added successfully', data: result, status: true });
//   } catch (error) {
//     console.error('Error updating shopping message:', error);
//     res.status(500).json({ message: 'Error updating shopping message', error: error.message });
//   }
// };

// const updateFamilyScore = async (req, res) => {
//   try {
//     const { userId, score } = req.body; 
//     console.log(userId, score, "check data");

//     if (!userId) {
//       return res.status(400).json({ message: 'userId is required' });
//     }
//     if (typeof score !== 'number') {
//       return res.status(400).json({ message: 'Valid score is required (must be a number)' });
//     }
//     const updateObject = {
//       $inc: { 'shopping.familyScore': score } 
//     };

//     const updatedFamilyScore = await StudentDetails.findOneAndUpdate(
//       { userId }, 
//       updateObject,
//       { new: true } 
//     );
//     if (!updatedFamilyScore) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.status(200).json({
//       message: 'Family score updated successfully',
//       status: true,
//       familyScore: updatedFamilyScore.shopping.familyScore 
//     });
//   } catch (error) {
//     console.error('Error updating family score:', error);
//     res.status(500).json({ message: 'Error updating family score', error: error.message });
//   }
// };
// const updateFamilyCurrentRole = async (req, res) => {
//   try {
//     const { userId, role } = req.body; 
//     console.log(userId, role, "check data");

//     if (!userId) {
//       return res.status(400).json({ message: 'userId is required' });
//     }
  
//     const updateObject = {
//       $inc: { 'shopping.currentRole': role } 
//     };

//     const updatedFamilyRole= await StudentDetails.findOneAndUpdate(
//       { userId }, 
//       updateObject,
//       { new: true } 
//     );
//     if (!updatedFamilyRole) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.status(200).json({
//       message: 'Family score updated successfully',
//       status: true,
//       familyScore: updatedFamilyRole.shopping.currentRole 
//     });
//   } catch (error) {
//     console.error('Error updating family score:', error);
//     res.status(500).json({ message: 'Error updating family score', error: error.message });
//   }
// };
const testAPi= async (req,res)=>{
  console.log(req.body)
}

module.exports = {
  // uploadFamilyDetails,
  // getFamilyDetails,
  // setMonthlyBudget,
  // updateNutritionRequirement,
  // updatePurchaseDetails,
  // updateAtHomeFamilyMembersDetails,
  // createPollDetails,
  // updatePollDetails,
  // updateRandomEvents,
  // updateFundUsed,
  // uploadSelectedNutrients,
  // updateShoppingMessage,
  // updateFamilyScore,
  // updateFamilyCurrentRole,
  testAPi
};
