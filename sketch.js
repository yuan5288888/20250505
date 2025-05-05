// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY, circleSize;
let isDragging = false; // 用於檢查手指是否正在拖動圓
let prevX, prevY; // 儲存手指的前一個位置

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
      if (hand.confidence > 0.1 && hand.keypoints.length > 4) {
        let thumbTip = hand.keypoints[4]; // 取得大拇指的關鍵點

        // 計算大拇指與圓心的距離
        let distanceToCircle = dist(thumbTip.x, thumbTip.y, circleX, circleY);

        if (distanceToCircle < circleSize / 2) {
          // 如果接觸到圓形，讓圓形跟隨大拇指移動
          if (!isDragging) {
            // 開始拖動時初始化前一個位置
            prevX = thumbTip.x;
            prevY = thumbTip.y;
          }
          isDragging = true;

          // 畫出手指的軌跡
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
          // 如果手指離開圓，停止畫軌跡
          isDragging = false;
        }
      }
    }
  }
}
