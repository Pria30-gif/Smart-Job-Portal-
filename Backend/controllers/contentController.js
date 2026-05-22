import ContentPost from "../models/ContentPost.js";

// Create a new content post with A/B testing variants
export const createPost = async (req, res) => {
  try {
    const { title, body, goal, audience, image, poll } = req.body;

    // Create two variants for A/B testing
    const variantA = {
      title: title,
      body: body,
      goal: goal,
      audience: audience,
      image: image,
      poll: poll,
      variant: "A"
    };

    const variantB = {
      title: title + " - Join Our Team!",
      body: body + "\n\nDon't miss this opportunity!",
      goal: goal,
      audience: audience,
      image: image,
      poll: poll,
      variant: "B"
    };

    // Save both variants
    const postA = new ContentPost(variantA);
    const postB = new ContentPost(variantB);

    await postA.save();
    await postB.save();

    res.status(201).json({
      success: true,
      message: "A/B testing started successfully",
      variants: [postA, postB]
    });
  } catch (error) {
    console.error("Error creating content post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create content post",
      error: error.message
    });
  }
};

// Get A/B testing results
export const getABResults = async (req, res) => {
  try {
    const posts = await ContentPost.find().sort({ createdAt: -1 }).limit(10);

    // Mock A/B results for demonstration
    const results = posts.map((post, index) => ({
      ...post.toObject(),
      metrics: {
        saves: index % 2 === 0 ? 35 : 48,
        comments: index % 2 === 0 ? 15 : 22,
        applications: index % 2 === 0 ? 20 : 32,
        engagement: index % 2 === 0 ? 70 : 102
      }
    }));

    res.status(200).json({
      success: true,
      results: results
    });
  } catch (error) {
    console.error("Error fetching A/B results:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch A/B results",
      error: error.message
    });
  }
};
