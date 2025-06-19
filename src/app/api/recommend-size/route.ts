import type { NextRequest } from "next/server";

// Simple rule-based recommendation system
function getRuleBasedRecommendation(
   height: number,
   weight: number,
   chest: number,
   waist: number
) {
   // Size determination based on chest measurement primarily
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

   // Adjust confidence based on proportions
   const waistChestRatio = waist / chest;
   if (waistChestRatio > 0.9 || waistChestRatio < 0.7) {
      confidence *= 0.9; // Reduce confidence for unusual proportions
   }

   return {
      size,
      confidence: Math.min(confidence, 0.95),
   };
}

export async function POST(request: NextRequest) {
   try {
      // Read the request body
      console.log(request.body)
      const body = await request.json();
      const { height, weight, chest, waist } = body;

      // Validate input types and presence
      if (
         typeof height !== "number" ||
         typeof weight !== "number" ||
         typeof chest !== "number" ||
         typeof waist !== "number"
      ) {
         return new Response(
            JSON.stringify({
               error: "All measurements must be valid numbers",
            }),
            { status: 400 }
         );
      }

      // Validate ranges
      if (height < 140 || height > 220) {
         return new Response(
            JSON.stringify({ error: "Height must be between 140-220 cm" }),
            { status: 400 }
         );
      }
      if (weight < 40 || weight > 150) {
         return new Response(
            JSON.stringify({ error: "Weight must be between 40-150 kg" }),
            { status: 400 }
         );
      }
      if (chest < 70 || chest > 130) {
         return new Response(
            JSON.stringify({ error: "Chest must be between 70-130 cm" }),
            { status: 400 }
         );
      }
      if (waist < 60 || waist > 120) {
         return new Response(
            JSON.stringify({ error: "Waist must be between 60-120 cm" }),
            { status: 400 }
         );
      }

      // Get recommendation
      const recommendation = getRuleBasedRecommendation(
         height,
         weight,
         chest,
         waist
      );

      // Return the response with explicit headers
      return new Response(
         JSON.stringify({
            size: recommendation.size,
            confidence: recommendation.confidence,
            measurements: {
               height,
               weight,
               chest,
               waist,
            },
            method: "rule-based",
         }),
         { status: 200}
      );
   } catch (error) {
      console.error("Error in size recommendation:", error);
      return new Response(
         JSON.stringify({
            error: "Internal server error occurred while processing your request",
         }),
         { status: 500}
      );
   }
}
