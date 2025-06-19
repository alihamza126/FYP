import express from 'express'
import { asyncWrapper } from '../helpers/asyncWrapper.js';



const aiRouter = express.Router();

// Rule-based size recommendation logic
function getRuleBasedRecommendation(height, weight, chest, waist) {
    let size = "M";
    let confidence = 0.7;

    if (chest <= 85) {
        size = "XS";
        confidence = height <= 160 ? 0.85 : 0.7;
    } else if (chest <= 90) {
        size = "S";
        confidence = height <= 170 && weight <= 60 ? 0.85 : 0.75;
    } else if (chest <= 95) {
        size = "M";
        confidence = height <= 175 && weight <= 75 ? 0.85 : 0.8;
    } else if (chest <= 100) {
        size = "L";
        confidence = height <= 180 && weight <= 85 ? 0.85 : 0.8;
    } else if (chest <= 105) {
        size = "XL";
        confidence = height <= 185 && weight <= 95 ? 0.85 : 0.75;
    } else {
        size = "XXL";
        confidence = height >= 185 ? 0.8 : 0.7;
    }

    const waistChestRatio = waist / chest;
    if (waistChestRatio > 0.9 || waistChestRatio < 0.7) {
        confidence *= 0.9;
    }

    return {
        size,
        confidence: Math.min(confidence, 0.95),
    };
}

// POST /api/recommend
aiRouter.post("/recommend", async (req, res) => {
    try {
        const { height, weight, chest, waist } = req.body;

        // Validate types
        if (
            typeof height !== "number" ||
            typeof weight !== "number" ||
            typeof chest !== "number" ||
            typeof waist !== "number"
        ) {
            return res.status(400).json({ error: "All measurements must be valid numbers" });
        }

        // Validate ranges
        if (height < 140 || height > 220) {
            return res.status(400).json({ error: "Height must be between 140-220 cm" });
        }
        if (weight < 40 || weight > 150) {
            return res.status(400).json({ error: "Weight must be between 40-150 kg" });
        }
        if (chest < 70 || chest > 130) {
            return res.status(400).json({ error: "Chest must be between 70-130 cm" });
        }
        if (waist < 60 || waist > 120) {
            return res.status(400).json({ error: "Waist must be between 60-120 cm" });
        }

        // Get recommendation
        const recommendation = getRuleBasedRecommendation(height, weight, chest, waist);

        // Return response
        return res.status(200).json({
            size: recommendation.size,
            confidence: recommendation.confidence,
            measurements: { height, weight, chest, waist },
            method: "rule-based",
        });
    } catch (error) {
        console.error("Error in recommendation:", error);
        return res.status(500).json({
            error: "Internal server error occurred while processing your request",
        });
    }
});




export default aiRouter;
