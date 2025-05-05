// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY, circleSize;
let isDragging = false; // 用於檢查大拇指是否正在拖動圓
let prevX, prevY; // 儲存大拇指的前一個位置
let prevFingerX, prevFingerY; // 儲存食指的前一個位置

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

  // 初始化圓的位置和大小
  circleX = width / 2;
  circleY = height / 2;
  circleSize = 100;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // 繪製圓形
  fill(0, 255, 0, 150);
  noStroke();
  circle(circleX, circleY, circleSize);

  // 確保至少有一隻手被偵測到
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 處理大拇指 (keypoints[4])
        if (hand.keypoints.length > 4) {
          let thumbTip = hand.keypoints[4]; // 取得大拇指的關鍵點
          let distanceToCircle = dist(thumbTip.x, thumbTip.y, circleX, circleY);

          if (distanceToCircle < circleSize / 2) {
            // 如果接觸到圓形，讓圓形跟隨大拇指移動
            if (!isDragging) {
              prevX = thumbTip.x;
              prevY = thumbTip.y;
            }
            isDragging = true;

            // 畫出大拇指的綠色軌跡
            stroke(0, 255, 0); // 綠色線條
            strokeWeight(2);
            line(prevX, prevY, thumbTip.x, thumbTip.y);

            // 更新圓的位置
            circleX = thumbTip.x;
            circleY = thumbTip.y;

            // 更新前一個位置
            prevX = thumbTip.x;
            prevY = thumbTip.y;
          } else {
            isDragging = false;
          }
        }

        // 處理食指 (keypoints[8])
        if (hand.keypoints.length > 8) {
          let fingerTip = hand.keypoints[8]; // 取得食指的關鍵點

          // 畫出食指的紅色軌跡
          if (prevFingerX !== undefined && prevFingerY !== undefined) {
            stroke(255, 0, 0); // 紅色線條
            strokeWeight(2);
            line(prevFingerX, prevFingerY, fingerTip.x, fingerTip.y);
          }

          // 更新食指的前一個位置
          prevFingerX = fingerTip.x;
          prevFingerY = fingerTip.y;
        }
      }
    }
  }
}
