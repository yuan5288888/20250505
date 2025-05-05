// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY, circleSize;

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Initialize circle position and size
  circleX = width / 2;
  circleY = height / 2;
  circleSize = 100;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Draw circle
  fill(0, 255, 0, 150);
  noStroke();
  circle(circleX, circleY, circleSize);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // Check if index finger (keypoints[8]) touches the circle
        if (hand.keypoints.length > 8) {
          let fingerTip = hand.keypoints[8];
          let distanceToCircle = dist(fingerTip.x, fingerTip.y, circleX, circleY);

          if (distanceToCircle < circleSize / 2) {
            // If touching the circle, make the circle follow the fingertip
            circleX = fingerTip.x;
            circleY = fingerTip.y;
          }
        }

        // Draw lines connecting keypoints 0 to 4
        if (hand.keypoints.length > 4) {
          if (hand.handedness == "Left") {
            stroke(255, 0, 255); // Left hand color
          } else {
            stroke(255, 255, 0); // Right hand color
          }
          strokeWeight(2);

          for (let i = 0; i < 4; i++) {
            let start = hand.keypoints[i];
            let end = hand.keypoints[i + 1];
            line(start.x, start.y, end.x, end.y);
          }
        }

        // Draw lines connecting keypoints 5 to 8
        if (hand.keypoints.length > 8) {
          if (hand.handedness == "Left") {
            stroke(255, 0, 255); // Left hand color
          } else {
            stroke(255, 255, 0); // Right hand color
          }
          strokeWeight(2);

          for (let i = 5; i < 8; i++) {
            let start = hand.keypoints[i];
            let end = hand.keypoints[i + 1];
            line(start.x, start.y, end.x, end.y);
          }
        }

        // Draw lines connecting keypoints 9 to 12
        if (hand.keypoints.length > 12) {
          if (hand.handedness == "Left") {
            stroke(255, 0, 255); // Left hand color
          } else {
            stroke(255, 255, 0); // Right hand color
          }
          strokeWeight(2);

          for (let i = 9; i < 12; i++) {
            let start = hand.keypoints[i];
            let end = hand.keypoints[i + 1];
            line(start.x, start.y, end.x, end.y);
          }
        }
      }
    }
  }
}
