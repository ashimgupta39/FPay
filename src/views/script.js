const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  // console.log('loaded')
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
  recognizeFaces();
}

async function recognizeFaces() {

  const labeledFaceDescriptors = await loadLabeledImage()
  console.log(labeledFaceDescriptors)
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
 video.addEventListener('play',async () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  // console.log('aa')

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

    const results = await resizedDetections.map((d) => {
      return faceMatcher.findBestMatch(d.descriptor)
  })
    console.log(results)
    console.log('hello')
    results.forEach((result, i) => {
    const box = resizedDetections[i].detection.box
    const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
    drawBox.draw(canvas)
    console.log('success')
    const btn = document.getElementById('btn')
    btn.disabled=false;
    });
    
  }, 100)
})
}
function loadLabeledImage() {
  const labe = document.getElementsByTagName("title");
    label = labe[0].innerHTML
  const labels = [label]
  return Promise.all(
    labels.map(async (lab) => {
      console.log(lab)
      const img= await faceapi.fetchImage (`${lab}.jpeg`)
      document.body.append(img)
      // console.log('a')
      const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor()
      console.log(detections)
      // console.log('b')
      if (!detections) {
        throw new Error(`no faces detected for ${lab}`)
      }
      const descriptions = []
      descriptions.push(detections.descriptor)
      console.log('c')
      console.log(descriptions)
      return new faceapi.LabeledFaceDescriptors(lab, descriptions)
    })
  )
}