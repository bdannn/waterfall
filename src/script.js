import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x333333) // Gray

/**
 * Environment
 */
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
    './textures/environmentMaps/1/px.png',
    './textures/environmentMaps/1/nx.png',
    './textures/environmentMaps/1/py.png',
    './textures/environmentMaps/1/ny.png',
    './textures/environmentMaps/1/pz.png',
    './textures/environmentMaps/1/nz.png',
])

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const grassTexture = textureLoader.load('./textures/grass.jpg')
const darkEarthTexture = textureLoader.load('./textures/darkEarth.jpg')
const lightEarthTexture = textureLoader.load('./textures/lightEarth.jpg')
const trunkTexture = textureLoader.load('./textures/trunk.jpg')
const pineTexture = textureLoader.load('./textures/pine.jpg')
const waterTexture = textureLoader.load('./textures/water.jpg')
const baseTexture = textureLoader.load('./textures/base.jpg')
const foamTexture = textureLoader.load('./textures/foamTexture.jpg')
// const furTexture = textureLoader.load('/textures/fur.jpg')


/**
 * Materials
 */
const grassMaterial = new THREE.MeshStandardMaterial({
    color: 0xCDE18F,
    roughness:1,
    metalness:0.2,
    map: grassTexture,
})
const foamMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness:1,
    metalness:0.1,
    map: foamTexture,
})
const branchMaterial = new THREE.MeshStandardMaterial({
    color: 0x5CA04C,
    map: pineTexture,
    roughness: 0.5,
    metalness: .1,
    envMap: environmentMapTexture,
    envMapIntensity: 1,
})
const trunkMaterial = new THREE.MeshStandardMaterial({
    //color: 0x271702,
    map: trunkTexture,})
const blueWaterMaterial = new THREE.MeshStandardMaterial({
    //color: 0x65AFE7,
    map: waterTexture,
    transparent: true,
    opacity: 0.75,
    metalness: 0,
    roughness: .2,
    envMap: environmentMapTexture,
    envMapIntensity: 1,
})
const pebbleMaterial = new THREE.MeshStandardMaterial({color: 0xAD9B88,})
const darkEarthMaterial = new THREE.MeshStandardMaterial({
    color: 0x696969,
    map: baseTexture,
    metalness: 0.1,
    roughness: 1,})
const mediumEarthMaterial = new THREE.MeshStandardMaterial({
    //color: 0x5C3611,
    map: darkEarthTexture,})
const lightEarthMaterial = new THREE.MeshStandardMaterial({
    color: 0xAD9B88,
    map: lightEarthTexture,})
const furMaterial = new THREE.MeshStandardMaterial({
    color: 0x3D2B10,
    // map: furTexture,
})

/**
 * Model
 */
let bearHead1
let bearHeadOrigin
const loader = new GLTFLoader()
loader.load('waterfall7.glb', (gltf) => {
    const model = gltf.scene
  
    const boundingBox = new THREE.Box3().setFromObject(model)
    const modelCenter = new THREE.Vector3()
    boundingBox.getCenter(modelCenter)
  
    const sceneCenter = new THREE.Vector3(0, 0, 0)
    const offset = new THREE.Vector3()
    offset.subVectors(sceneCenter, modelCenter)
    model.position.add(offset)

    model.rotation.y = THREE.MathUtils.degToRad(73)

    model.traverse(child => {
        if (child instanceof THREE.Mesh) {
            child.receiveShadow = true
            child.castShadow = true
        }
    })

    const grass = model.getObjectByName('grass1')
    grass.material = grassMaterial

    const foam = model.getObjectByName('foam1')
    foam.material = foamMaterial

    const branch = model.getObjectByName('pine1')
    branch.material = branchMaterial

    const trunk = model.getObjectByName('trunk1')
    trunk.material = trunkMaterial

    const waterbottom = model.getObjectByName('watercombined')
    waterbottom.material = blueWaterMaterial

    const pebbles = model.getObjectByName('pebbles')
    pebbles.material = pebbleMaterial

    const earthBase = model.getObjectByName('base1')
    earthBase.material = darkEarthMaterial

    const raisedEarthMedium = model.getObjectByName('darkGround1')
    raisedEarthMedium.material = mediumEarthMaterial

    const raisedEarthLight = model.getObjectByName('lightGround1')
    raisedEarthLight.material = lightEarthMaterial

    const bearBody = model.getObjectByName('body')
    bearBody.material = furMaterial

    const bearHead = model.getObjectByName('head')
    bearHead.material = furMaterial
    bearHead1 = bearHead
    bearHeadOrigin = bearHead1.position.z
  
    scene.add(model)
  })

/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight(0xffff40, 2)
directionalLight.position.set(23, 35, 30) // Set the position of the light
directionalLight.castShadow = true
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.16)
scene.add(ambientLight)

const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x7f7f7f, .2) // Sky color and ground color
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xffffff, .5, 4)
pointLight.position.set(-0.1, 3, -0.8)
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xffffff, .5, 4)
pointLight2.position.set(-0.1, 3, 1)
scene.add(pointLight2)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 30
camera.position.y = 1
camera.position.z = 15
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true
controls.enablePan = false
controls.maxPolarAngle = Math.PI/2
controls.minDistance = 18
controls.maxDistance = 50

controls.minZoom = .3
controls.maxZoom = .3

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
directionalLight.shadow.camera.left = -50;  // Adjust the left boundary of the shadow camera's view
directionalLight.shadow.camera.right = 50;   // Adjust the right boundary of the shadow camera's view
directionalLight.shadow.camera.top = 50;     // Adjust the top boundary of the shadow camera's view
directionalLight.shadow.camera.bottom = -50;
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.far = 70
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
// Waterfall
const clock = new THREE.Clock()

let currentTime = 0
const speed1 = 3000
const speed2 = 2000

function animatePointLights() {
  currentTime += clock.getDelta()

  const distance1 = speed1 * currentTime
  const distance2 = speed2 * currentTime

  // Calculate the positions of both point lights
  pointLight.position.y = 3 - distance1 % 12
  pointLight2.position.y = 3 - distance2 % 12
}

/**
 * Bear animation
 */
const bearAnimationDuration = 2
const bearPauseDuration = 2 // 2 seconds pause at top and bottom
let bearAnimationStartTime = -1
let bearPauseStartTime = -1 // To track the start of the pause

function moveBearHead(elapsedTime) {
    if (bearAnimationStartTime === -1) {
        bearAnimationStartTime = elapsedTime
    }

    // Calculate total animation duration
    const totalAnimationDuration = bearAnimationDuration * 2 + bearPauseDuration * 2

    const animationProgress = (elapsedTime - bearAnimationStartTime) / totalAnimationDuration

    if (animationProgress <= 1) {
        if (animationProgress <= 0.25) {
            // First quarter: move the head downward
            const downwardProgress = animationProgress * 4
            bearHead1.rotation.z = THREE.MathUtils.degToRad(30 - (30 * downwardProgress))
        } else if (animationProgress <= 0.5) {
            // Second quarter: pause at the bottom
            if (bearPauseStartTime === -1) {
                bearPauseStartTime = elapsedTime
            }
            const pauseProgress = (elapsedTime - bearPauseStartTime) / bearPauseDuration
            if (pauseProgress <= 1) {
                // Pause at the bottom
                bearHead1.rotation.z = THREE.MathUtils.degToRad(0)
            } else {
                // Continue to the second half: move the head upward
                const upwardProgress = (animationProgress - 0.5) * 4
                bearHead1.rotation.z = THREE.MathUtils.degToRad(-30 + (30 * upwardProgress))
            }
        } else if (animationProgress <= 0.75) {
            // Third quarter: move the head upward
            const upwardProgress = (animationProgress - 0.5) * 4
            bearHead1.rotation.z = THREE.MathUtils.degToRad(-30 + (30 * upwardProgress))
        } else {
            // Fourth quarter: pause at the top
            if (bearPauseStartTime === -1) {
                bearPauseStartTime = elapsedTime
            }
            const pauseProgress = (elapsedTime - bearPauseStartTime) / bearPauseDuration
            if (pauseProgress <= 1) {
                // Pause at the top
                bearHead1.rotation.z = THREE.MathUtils.degToRad(0)
            } else {
                // Animation completed, reset start time
                bearAnimationStartTime = -1
                bearPauseStartTime = -1
                bearHead1.rotation.z = 0
            }
        }
    }
}

// Create X, Y, and Z axis helpers
// const axisX = new THREE.AxesHelper(4) // Length
// const axisY = new THREE.AxesHelper(4)
// const axisZ = new THREE.AxesHelper(4)

// // Position the axis helpers
// axisX.position.set(-.25, -10.4, 1.8)
// axisY.position.set(-.25, -10.4, 1.8)
// axisZ.position.set(-.25, -10.4, 1.8)

// scene.add(axisX)
// scene.add(axisY)
// scene.add(axisZ)

/**
 * Foam
 */
// Create an array to hold the spheres for each group
const spheresGroup1 = []
const spheresGroup2 = []
const spheresGroup3 = []
const spheresGroup4 = []
const spheresGroup5 = []
const spheresGroup6 = []
const spheresGroup7 = []
const spheresGroup8 = []

// Function to create a random sphere with a specified lifespan and position range
function createRandomSphere(minX, locY, minZ, maxX, maxZ, spheresArray) {
    const radius = Math.random() * 0.1 + 0.05 // Adjust the size range
    const geometry = new THREE.SphereGeometry(radius, 32, 32)
    const material = foamMaterial
    const sphere = new THREE.Mesh(geometry, material)

    // Set random initial position within the specified range
    sphere.position.x = THREE.MathUtils.randFloat(minX, maxX) // Adjust the X range
    sphere.position.y = locY // Adjust the Y range
    sphere.position.z = THREE.MathUtils.randFloat(minZ, maxZ) // Adjust the Z range

    // Add the sphere to the scene
    scene.add(sphere)

    // Set a start time for the sphere's lifespan
    sphere.userData.startTime = Date.now()

    // Reset the position.y to the initial Y position
    sphere.userData.initialY = sphere.position.y

    // Add the sphere to the specified group's array
    spheresArray.push(sphere)
}

// Function to create spheres for each group
function createSpheresForGroups() {
    for (let i = 0; i < 20; i++) {
        createRandomSphere(-1.55, 3.8, 1.8, -1.65, 1.5, spheresGroup1)
    }

    for (let i = 0; i < 20; i++) {
        createRandomSphere(-1.55, 3.8, 0, -1.65, -.3, spheresGroup2)
    }

    for (let i = 0; i < 20; i++) {
        createRandomSphere(-.24, -10.25, 2.1, -.20, 2, spheresGroup3)
    }

    for (let i = 0; i < 20; i++) {
        createRandomSphere(.2, -10.25, 0, .1, -.3, spheresGroup4)
    }

    for (let i = 0; i < 20; i++) {
        createRandomSphere(-.27, -10.25, 1.95, -.25, 1.85, spheresGroup5)
    }

    for (let i = 0; i < 20; i++) {
        createRandomSphere(.4, -10.25, .1, .3, -.2, spheresGroup6)
    }

    for (let i = 0; i < 20; i++) {
        createRandomSphere(-.2, -10.25, 2, -.18, 2.2, spheresGroup7)
    }

    for (let i = 0; i < 20; i++) {
        createRandomSphere(0, -10.25, -1.25, -.1, -.9, spheresGroup8)
    }
}

// Create spheres for both groups
createSpheresForGroups();

// Function to animate the spheres for each group
function animateSpheres(spheresArray) {
    // Animate spheres
    for (let i = spheresArray.length - 1; i >= 0; i--) {
        const sphere = spheresArray[i]

        // Move the sphere up and down
        sphere.position.y += 0.008 * Math.sin(Date.now() * 0.015) // Adjust the speed as needed

        // Check if the sphere's lifetime has exceeded a certain duration
        if (sphere.userData.startTime && Date.now() - sphere.userData.startTime > 2000) {
            scene.remove(sphere)
            spheresArray.splice(i, 1)
        }
    }
}

// Function to animate both groups of spheres
function animateAllSpheres() {
    // Create a new sphere for each group every few seconds
    let randomNum = Math.random()
    if (randomNum < 0.01) {
        createRandomSphere(-1.55, 3.8, 1.8, -1.65, 1.5, spheresGroup1)
        createRandomSphere(.2, -10.25, 0, .1, -.3, spheresGroup4)
    }
    if (randomNum >= 0.01 && randomNum < 0.02) {
        createRandomSphere(-.27, -10.25, 1.95, -.25, 1.85, spheresGroup5)
        createRandomSphere(0, -10.25, -1.25, -.1, -.9, spheresGroup8)
    }
    if (randomNum >= 0.02 && randomNum < 0.03) {
        createRandomSphere(-1.55, 3.8, 0, -1.65, -.3, spheresGroup2)
        createRandomSphere(.4, -10.25, .1, .3, -.2, spheresGroup6)
    }
    if (randomNum >= 0.03 && randomNum < 0.04) {
        createRandomSphere(-.24, -10.25, 2.1, -.20, 2, spheresGroup3)
        createRandomSphere(-.2, -10.25, 2, -.18, 2.2, spheresGroup7)
    }

    // Animate spheres for each group
    animateSpheres(spheresGroup1)
    animateSpheres(spheresGroup2)
    animateSpheres(spheresGroup3)
    animateSpheres(spheresGroup4)
    animateSpheres(spheresGroup5)
    animateSpheres(spheresGroup6)
    animateSpheres(spheresGroup7)
    animateSpheres(spheresGroup8)
}

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Update objects
    animatePointLights()

    if(bearHead1) {
        moveBearHead(elapsedTime)
    }

    // Start the animation
    animateAllSpheres()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()