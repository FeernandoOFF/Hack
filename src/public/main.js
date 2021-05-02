/* eslint-disable no-undef */
const video = document.getElementById('video');
let labels;
let includeLabels;
const URL = 'http://119.8.2.130:3000/';
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
]).then(startVideo);

async function startVideo() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
    })
    .then(
      (stream) => (video.srcObject = stream),
      (err) => console.log(err)
    );
}

video.addEventListener('play', async () => {
  const labeledFaceDescriptors = await loadLabeledImages();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();
    console.log(detections);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const res = resizedDetections.map((l) =>
      faceMatcher.findBestMatch(l.descriptor)
    );
    res.forEach((resul, i) => {
      let cu = resul.toString();
      includeLabels.forEach(async (ls) => {
        if (cu.includes(ls)) {
          console.log('Coincidencia', ls);
          fetch('http://119.8.2.130:3000/consult', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
              id: ls,
              temp: 33, //cambiar
              date: '2023-04-28',
              hour: '10:00:20',
              importe: 20,
            }),
          })
            .then((data) => data.json())
            .then((res) => {
              console.log(res);
              let index = includeLabels.indexOf(ls);
              if (index > -1) {
                includeLabels.splice(index, 1);
              }
            });
        }
      });
      const box = resizedDetections[i].detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: resul.toString(),
      });
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      drawBox.draw(canvas);
    });
  }, 100);
});

function loadLabeledImages() {
  labels = ['182610-1', '182610-2'];
  includeLabels = labels;
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= 1; i++) {
        console.log(
          'Persona: ',
          label,
          'SRC: ',
          `https://raw.githubusercontent.com/FeernandoOFF/FeernandoOFF.github.io/main/static/${label}/${i}.jpeg)`
        );
        const img = await faceapi.fetchImage(
          `https://raw.githubusercontent.com/FeernandoOFF/FeernandoOFF.github.io/main/static/${label}/${i}.jpeg`
        );
        const d = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(d.descriptor);
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}
async function postData(endPoint, data, met = 'POST') {
  // Opciones por defecto estan marcadas con un *
  const response = await fetch(`${URL}${endPoint}`, {
    method: met, // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors', // no-cors, *cors, same-origin
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
