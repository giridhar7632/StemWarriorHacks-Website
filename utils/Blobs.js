import { memo } from 'react'
import Sketch from 'react-p5'
import toxi from 'toxiclibsjs'

const Blobs = () => {
	const Polygon2D = toxi.geom.Polygon2D,
		Vec2D = toxi.geom.Vec2D,
		ColorRange = toxi.color.ColorRange,
		MathUtils = toxi.math.MathUtils

	let isSmallScreen = matchMedia('screen and (max-width: 480px)').matches

	let POLYGONS = []
	let HEIGHT = isSmallScreen ? 3.5 : 2
	const VERTICES = 30
	const AUTOPOLYS = isSmallScreen ? 25 : 10

	const setup = (p5, canvasParentRef) => {
		p5.createCanvas(window.innerWidth, window.innerHeight * HEIGHT).parent(
			canvasParentRef
		)
		p5.noStroke()
	}

	const draw = (p5) => {
		p5.clear()

		if (POLYGONS.length < AUTOPOLYS) {
			createPolyAt(
				MathUtils.random(0, window.innerWidth),
				MathUtils.random(0, window.innerHeight * HEIGHT)
			)
		}

		POLYGONS.forEach((p) => {
			p5.fill(p.col.toRGBACSS())
			p.smooth(0.05, 0)
			p5.beginShape()
			p.vertices.forEach((v) => {
				p5.vertex(v.x, v.y)
			})
			p5.endShape(toxi.CLOSE)
		})
	}

	const mousePressed = (p5) => {
		createPolyAt(p5.mouseX, p5.mouseY)
	}

	const windowResized = (p5) => {
		isSmallScreen = matchMedia('screen and (max-width: 480px)').matches
		HEIGHT = isSmallScreen ? 3.5 : 2

		p5.resizeCanvas(window.innerWidth, window.innerHeight * HEIGHT)
	}

	const createPolyAt = (x, y) => {
		const col = ColorRange.BRIGHT.getColor().setAlpha(
			MathUtils.random(0.5, 0.8)
		)
		const poly = new ColoredPolygon(col)
		const radius = isSmallScreen
			? MathUtils.random(30, 100)
			: MathUtils.random(30, 300)

		for (let i = 0; i < VERTICES; i++) {
			poly.add(
				Vec2D.fromTheta((i / VERTICES) * MathUtils.TWO_PI)
					.scaleSelf(MathUtils.random(0.2, 1) * radius)
					.addSelf(x, y)
			)
		}

		POLYGONS.push(poly)
	}

	function ColoredPolygon(tcolor) {
		Polygon2D.call(this)
		this.col = tcolor
	}

	ColoredPolygon.prototype = Object.create(Polygon2D.prototype)

	return (
		<Sketch
			setup={setup}
			draw={draw}
			mousePressed={mousePressed}
			windowResized={windowResized}
			role='img'
		/>
	)
}

export default memo(Blobs)
