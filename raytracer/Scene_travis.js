class Scene_travis{
	constructor(name, fog){
		this.name=name
		this.objects=[]
		this.lights=[]
		this.globalAmbient = Color.BLACK //new Color(0.1,0.1,0.1)
		this.threshold_fogDistance = 6;
		// this.fog_pos = new Vector3(0,2,4);
		this.fog_pos = new Vector3(0,6,10);
		this.balls = []
		this.maxDis = 0
		this.minDis = 100
		this.fog = fog
	}

	addObject(x){
		this.objects.push(x)
	}
	addBall(x) {
		this.balls.push(x)
	}
	addLight(x){
		this.lights.push(x)
	}

	getColorForRay(ray,depth){
		const intersection = this.intersect(ray)

		let theColor
		//if (Math.random()<0.001) console.dir([ray,intersection])
		if (intersection.isEmpty()){
			return(Color.BLACK)
		} else {
			const obj = intersection.object
			// console.log("object= " + obj)
			const p = intersection.point
			const n = intersection.normal
			const uv = intersection.uv
			const mat = obj.material
			const e = ray.p.subtract(p).normalize()

			let textureColor = new Color(1,1,1)
			if (mat.texture!='none'){
				textureColor = mat.texture.pixel(uv.u,uv.v)
			}
			theColor = this.calculateColor(p,n,e,mat,textureColor)

			if (depth > 1 && mat.reflectivity >0) {
				const ray1 = this.reflectionRay(ray,n,p)
				//console.dir(['ray1',ray1,ray,n,p])
				//console.log(unknown)
				let color2 = this.getColorForRay(ray1,depth-1)
				//console.dir(['gCFR',mat.reflectivity,theColor,color2])

				theColor = Color.average(mat.reflectivity,color2,theColor)
			}
			return theColor

		}

	}

	getColorForRay2(ray,depth, theColor){
		// theColor= this.globalAmbient
		const intersectionBall = this.intersectBall(ray)

		//if (Math.random()<0.001) console.dir([ray,intersection])

		if (intersectionBall.isEmpty()){
			return theColor
		} else {
			const obj = intersectionBall.object
			// console.log("object= " + obj)
			const p = intersectionBall.point
			const n = intersectionBall.normal
			const uv = intersectionBall.uv
			const mat = obj.material
			const e = ray.p.subtract(p).normalize()

			let textureColor = new Color(1,1,1)
			if (mat.texture!='none'){
				textureColor = mat.texture.pixel(uv.u,uv.v)
			}
			theColor = this.calculateFogColor(p,n,e,mat,textureColor, theColor)

			if (depth > 1 && mat.reflectivity >0) {
				const ray1 = this.reflectionRay(ray,n,p)
				//console.dir(['ray1',ray1,ray,n,p])
				//console.log(unknown)
				let color2 = this.getColorForRay(ray1,depth-1)
				//console.dir(['gCFR',mat.reflectivity,theColor,color2])

				theColor = Color.average(mat.reflectivity,color2,theColor)
			}
			return theColor
		}
	}

	reflectionRay(ray,n,p) {
		let alpha = n.scale(n.dot(ray.d))
		let d1 = ray.d.subtract(alpha.scale(2)).normalize()
		let p1 = p.add(d1.scale(0.001))
		return new Ray3(p1,d1)
	}


	intersect(ray) {
		// console.log("objects len = " + this.objects.length)
		return Scene.intersectObjects(ray,this.objects)
	}
	intersectBall(ray) {
		return Scene.intersectObjects(ray,this.balls)
	}


	static intersectObjects(ray,objects){
		// intersect the ray with each object
		let z = objects.map(
			function(x){
				return x.intersectRay(ray)});
		// throw out the non-intersections
		z = z.filter(
			function(x){
				return x.object!= null})
		// if the ray didn't intersect any objects, return a non-intersection object
		if (z.length==0)
			return RayIntersection.none()

		// now we know it did intersect an object so lets find the closest one
		//let mindist=z[0].distance
		let minIntersection=z[0]
		let mindist = minIntersection.point.subtract(ray.p).length()
		for(let x of z){
			const distance = x.point.subtract(ray.p).length()
			if (distance < mindist) {
				mindist = distance
				minIntersection = x
			}
		}
		return minIntersection

	}
	fogreaches(point) {
		const lightdir = point.subtract(this.fog_pos);
		const lightray = new Ray3(this.fog_pos,lightdir)
		const ri = this.intersect(lightray);
		if (ri.point== null) return false
		return (ri.point.subtract(point).length()<0.01)
	}

	reaches(light,point){
		const lightdir = point.subtract(light.position);
		const lightray = new Ray3(light.position,lightdir)
		const ri = this.intersect(lightray);
		if (ri.point== null) return false
		return (ri.point.subtract(point).length()<0.01)
	}


	calculateColor(point, normal, eye, mat, textureColor){
		if (mat.nolighting) return textureColor
		let theColor= this.globalAmbient
		for(let light of this.lights){
			if (this.reaches(light, point)){


				const ambient = light.ambient().times(mat.ambient)
				const diffuse = light.diffuse(point,normal).times(mat.diffuse).times(textureColor)
				const specular = light.specular(point, normal, eye, mat.shininess).times(mat.specular)
				theColor =
					theColor
						.add(ambient)
						.add(diffuse)
						.add(specular)
			}
		}







		if (Math.random()<0.001){
			console.dir([point,normal,eye,mat,textureColor])
		}

		return theColor.add(new Color(0,0,0))
	}

	calculateFogColor(point, normal, eye, mat, textureColor, theColor){
		if (mat.nolighting) return textureColor


		if (this.fogreaches(point)) {
			// if (false) {
			let fog_color = Color.WHITE;
			// let fog_white = Color.WHITE;
			let fogDistance = this.fog_pos.subtract(point).length()
			// let rand = Math.random() * 3 + 7
			// console.log("rand = " + rand)
			if (fogDistance > this.threshold_fogDistance + 6) {
				// return Color.WHITE;
			} else {
				// fog_color.r = (1 - theColor.r)* fogDistance / this.threshold_fogDistance;
				// fog_color.g = (1 - theColor.g) * fogDistance / this.threshold_fogDistance;
				// fog_color.b = (1 - theColor.b) * fogDistance / this.threshold_fogDistance;

				// fog_color.r = Color.WHITE * (1 - fogDistance / this.threshold_fogDistance) * 0.3;
				// fog_color.g = Color.WHITE * (1 - fogDistance / this.threshold_fogDistance) * 0.3;
				// fog_color.b = Color.WHITE * (1 - fogDistance / this.threshold_fogDistance) * 0.3;


				// fog_color = new Color(
				// 	fog_color.r * (1 - Math.log(fogDistance /this.threshold_fogDistance + 1)) ,
				// 	fog_color.g * (1 - Math.log(fogDistance /this.threshold_fogDistance + 1) ) ,
				// 	fog_color.b * (1 - Math.log(fogDistance /this.threshold_fogDistance + 1) ) ,
				// );
				this.maxDis = Math.max(this.maxDis, fogDistance)
				this.minDis = Math.min(this.minDis, fogDistance)

				fog_color = new Color(
					fog_color.r * (0.1 + Math.log((fogDistance - 6) /this.threshold_fogDistance + 1)) * 0.9,
					fog_color.g * (0.1 + Math.log((fogDistance - 6)/this.threshold_fogDistance + 1) ) * 0.9,
					fog_color.b * (0.1 +  Math.log((fogDistance - 6)/this.threshold_fogDistance + 1) ) * 0.9,
				);
				console.log("fog r=" + fog_color.r)
				theColor = theColor.add(fog_color);
				// console.log("light.fog")
				console.log("maxdis = " + this.maxDis + "minDis = " + this.minDis)
			}
		}





		if (Math.random()<0.001){
			console.dir([point,normal,eye,mat,textureColor])
		}

		return theColor.add(new Color(0,0,0))
	}

}
