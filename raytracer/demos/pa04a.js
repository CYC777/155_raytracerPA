
let textures = []
textures.push(new Texture('/images/dragonball1.png'))
textures.push(new Texture('/images/dragonball2.png'))
textures.push(new Texture('/images/dragonball3.png'))
textures.push(new Texture('/images/dragonball4.png'))
textures.push(new Texture('/images/dragonball5.png'))
textures.push(new Texture('/images/dragonball6.png'))
textures.push(new Texture('/images/dragonball7.png'))

texture1 = new Texture('/images/dragonBall.jpg')

document.getElementById('title').innerHTML="demos/pa04a"

function runTest(){
	canvas.width=900
	canvas.height=900
	// const renderer = new Renderer(400,400)
	const renderer = new Renderer(900,900)
	// const scene = new Scene('pa04a')
	const scene = new Scene_travis('pa04a', true)
	// const scene = new Scene_tang('pa04a', false)

	const mat1 = Material.standard()
	mat1.texture = texture1
	mat1.textureWeight = 0.5
	mat1.texture.repeatU=1
	mat1.texture.repeatV=1

	// const mat2 = Material.standard()
	// mat2.texture = texture2
	// mat2.textureWeight = 0.5
	// mat2.texture.repeatU=1
	// mat2.texture.repeatV=1

	//const s1 = new Sphere(new Vector3(-2,0,-80),20)
	//const s2 = new Sphere(new Vector3(-50,0,-80),10)
	// const s0 = new Sphere()
	// s0.material = mat2
	// s0
	//   //.translate(new Vector3(25,5,25))
	//   .scale(new Vector3(0.5,0.5,0.5))
	//
	// scene.addObject(s0)

	let dx = -4, dz = 0
	let balls = []
	for (let i = 0; i < 7; i++) {
		let texture = textures[i]
		const mat = Material.standard()
		mat.texture = texture
		mat.textureWeight = 0.5
		mat.texture.repeatU=1
		mat.texture.repeatV=1
		let s = new Sphere()
		s.material = mat
		s
			.translate(new Vector3(dx,1,dz))
			.scale(new Vector3(0.5,0.5,0.5))
		scene.addObject(s)
		balls.push(s)
		if (scene.fog)
			scene.addBall(s)
		dx += 1
		dz += 1
		console.log(i)
	}
	// const s1 = new Sphere()
	// s1.material=mat2
	// s1
	// 	//.rotateZ(Math.PI*0.5)
	//   .translate(new Vector3(2,0,-2))
	// //s1.material=mat2
  // scene.addObject(s1)

	// const s2 = new Sphere()
	// s2.material = mat2
	// s2.translate(new Vector3(25,5,40))
	//   .scale(new Vector3(5,5,5))

	//scene.addObject(s2)
	const g=15
	const ground = new Square()
	ground.material = mat1
	ground
		.rotateY(Math.PI)
		.rotateX(Math.PI * (1/ 2 +1/18) )
	 // .translate(new Vector3(-30,-10,-50))
		.scale(new Vector3(g,g,1))
		.translate(new Vector3(-0.5,-0.5,0.5))
	// ground.rotateX(-Math.PI / 2)


	scene.addObject(ground)


	const light1 = new Light(new Vector3(-6,15,10), false)
	light1.intensity = 0.5
	light1.diffuseColor = Color.WHITE
	light1.specularColor = Color.WHITE
	scene.addLight(light1)

	const light2 = new Light(new Vector3(-8,5,8), false)
	light2.intensity = 0.75
	light2.diffuseColor = Color.WHITE
	light2.specularColor = Color.BLUE
	scene.addLight(light2)

	// const fog = new Light(new Vector3(0,2,4), true)
	// fog.intensity = 0
	// fog.diffuseColor = Color.WHITE
	// scene.addLight(fog)

	const camera = new Camera()
	camera.translate(new Vector3(0,6,10))
	camera.lookAt(balls[4].position)


	renderer.render(scene,camera)
}

setTimeout(runTest, 1000)
