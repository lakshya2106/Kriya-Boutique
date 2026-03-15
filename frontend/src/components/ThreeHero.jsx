import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeHero({ scrollProgress = 0 }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({})

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── RENDERER ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2

    // ── SCENE & CAMERA ────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100)
    camera.position.set(1.8, 0.4, 6)

    // ── LIGHTS ────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xfff5e8, 0.7))

    const keyLight = new THREE.DirectionalLight(0xffe8c8, 3)
    keyLight.position.set(3, 5, 4)
    keyLight.castShadow = true
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0xc8a45a, 1.5)
    rimLight.position.set(-4, 3, -2)
    scene.add(rimLight)

    const fillLight = new THREE.PointLight(0xe8a0b8, 0.8, 15)
    fillLight.position.set(0, -1, 4)
    scene.add(fillLight)

    // Coloured accent lights mimicking lehenga colours
    const greenLight = new THREE.PointLight(0x2d8a4e, 0.6, 8)
    greenLight.position.set(-2, 1, 2)
    scene.add(greenLight)

    const pinkLight = new THREE.PointLight(0xe0357a, 0.4, 8)
    pinkLight.position.set(2, -0.5, 2)
    scene.add(pinkLight)

    // ── MATERIALS ─────────────────────────────────────────
    const skinMat   = new THREE.MeshStandardMaterial({ color: 0xc49878, roughness: 0.7, metalness: 0.05 })
    const hairMat   = new THREE.MeshStandardMaterial({ color: 0x1a1008, roughness: 0.9 })
    const greenMat  = new THREE.MeshStandardMaterial({ color: 0x2d8a4e, roughness: 0.4, metalness: 0.1 })
    const fuchsiaMat= new THREE.MeshStandardMaterial({ color: 0xe0357a, roughness: 0.45, metalness: 0.05 })
    const goldMat   = new THREE.MeshStandardMaterial({ color: 0xc8a45a, roughness: 0.2, metalness: 0.8, emissive: 0x8a6020, emissiveIntensity: 0.3 })
    const embMat    = new THREE.MeshStandardMaterial({ color: 0xf0e0a0, roughness: 0.3, metalness: 0.6, emissive: 0xd4b060, emissiveIntensity: 0.4 })

    // ── BUILD FIGURE ──────────────────────────────────────
    const group = new THREE.Group()

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), skinMat)
    head.position.set(0, 2.22, 0)
    group.add(head)

    // Hair
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.27, 24, 24), hairMat)
    hair.position.set(0, 2.44, -0.06)
    hair.scale.set(1, 0.62, 0.88)
    group.add(hair)

    // Bun detail
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), hairMat)
    bun.position.set(0, 2.62, -0.18)
    group.add(bun)

    // Maang tikka (headpiece)
    const tikka = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), goldMat)
    tikka.position.set(0, 2.52, 0.2)
    group.add(tikka)

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.115, 0.28, 16), skinMat)
    neck.position.set(0, 1.88, 0)
    group.add(neck)

    // Blouse/choli (fitted top) — green
    const blouseGeo = new THREE.CylinderGeometry(0.27, 0.21, 0.65, 32)
    const blouse = new THREE.Mesh(blouseGeo, greenMat)
    blouse.position.set(0, 1.3, 0)
    group.add(blouse)

    // Blouse embroidery dots
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const r = 0.28
      const emb = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), embMat)
      emb.position.set(Math.cos(angle) * r, 1.38 + Math.sin(i * 0.5) * 0.06, Math.sin(angle) * r)
      group.add(emb)
    }

    // Waist (midriff)
    const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.15, 32), skinMat)
    waist.position.set(0, 0.97, 0)
    group.add(waist)

    // Gold waist belt (kamarbandh)
    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.225, 0.022, 8, 64), goldMat)
    belt.position.set(0, 0.97, 0)
    group.add(belt)

    // Lehenga skirt — lathe geometry for realistic flare
    // Fuchsia inner + green outer (like the actual lehenga!)
    const skirtPoints = []
    for (let i = 0; i <= 32; i++) {
      const t = i / 32
      const y = -1.3 + t * 2.1
      // Dramatic flare with slight S-curve for realism
      const base = 0.22
      const flare = t < 0.1 ? base + t * 0.3 : base + 0.03 + t * 0.95 + Math.sin(t * Math.PI) * 0.25
      skirtPoints.push(new THREE.Vector2(flare, y))
    }

    // Outer green layer
    const outerSkirt = new THREE.Mesh(new THREE.LatheGeometry(skirtPoints, 80), greenMat)
    outerSkirt.position.set(0, 0.55, 0)
    group.add(outerSkirt)

    // Inner fuchsia layer (slightly smaller, showing at front)
    const innerPoints = skirtPoints.map(p => new THREE.Vector2(p.x * 0.88, p.y))
    const innerSkirt = new THREE.Mesh(new THREE.LatheGeometry(innerPoints, 80), fuchsiaMat)
    innerSkirt.position.set(0.08, 0.55, 0.12)
    innerSkirt.rotation.y = 0.4
    group.add(innerSkirt)

    // Gold gota border at hem
    const hemGeo = new THREE.TorusGeometry(1.12, 0.028, 8, 80)
    const hem = new THREE.Mesh(hemGeo, goldMat)
    hem.position.set(0, -0.75, 0)
    group.add(hem)

    // Second gold border
    const hem2 = new THREE.Mesh(new THREE.TorusGeometry(1.06, 0.018, 8, 80), goldMat)
    hem2.position.set(0, -0.58, 0)
    group.add(hem2)

    // Dupatta hint (draped fabric suggestion)
    const dupattaGeo = new THREE.PlaneGeometry(0.8, 1.4, 8, 16)
    // Deform plane for natural drape
    const pos2 = dupattaGeo.attributes.position
    for (let i = 0; i < pos2.count; i++) {
      const x = pos2.getX(i), y = pos2.getY(i)
      pos2.setZ(i, Math.sin(x * 3) * 0.05 + Math.cos(y * 2) * 0.08)
    }
    dupattaGeo.computeVertexNormals()
    const dupattaMat = new THREE.MeshStandardMaterial({
      color: 0x2d8a4e, roughness: 0.5, metalness: 0.05,
      transparent: true, opacity: 0.75, side: THREE.DoubleSide
    })
    const dupatta = new THREE.Mesh(dupattaGeo, dupattaMat)
    dupatta.position.set(-0.42, 1.35, 0.1)
    dupatta.rotation.set(0.1, 0.3, -0.15)
    group.add(dupatta)

    // Shoulders + Arms
    ;[-1, 1].forEach(side => {
      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), greenMat)
      shoulder.position.set(side * 0.36, 1.65, 0)
      shoulder.scale.set(1.3, 0.7, 0.9)
      group.add(shoulder)

      // Upper arm
      const armGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.5, 12)
      const arm = new THREE.Mesh(armGeo, greenMat)
      arm.position.set(side * 0.46, 1.38, 0.08)
      arm.rotation.z = side * 0.25
      arm.rotation.x = 0.1
      group.add(arm)

      // Forearm / hand
      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.055, 0.4, 12), skinMat)
      forearm.position.set(side * 0.54, 1.1, 0.14)
      forearm.rotation.z = side * 0.35
      forearm.rotation.x = 0.2
      group.add(forearm)

      // Bangle stack
      for (let b = 0; b < 3; b++) {
        const bangle = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.008, 6, 24), goldMat)
        bangle.position.set(side * 0.55 + b * side * 0.01, 0.98 + b * 0.02, 0.18)
        bangle.rotation.z = side * 0.35
        group.add(bangle)
      }
    })

    // ── NECKLACE ──────────────────────────────────────────
    for (let i = 0; i < 16; i++) {
      const angle = -Math.PI * 0.6 + (i / 15) * Math.PI * 0.6 + Math.PI * 0.7
      const r = 0.22
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), goldMat)
      bead.position.set(Math.cos(angle) * r, 1.72 - Math.abs(i - 7.5) * 0.015, Math.sin(angle) * r * 0.5 + 0.12)
      group.add(bead)
    }

    // ── FLOATING PARTICLES ────────────────────────────────
    const pGeo = new THREE.BufferGeometry()
    const pCount = 150
    const pArr = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      const r = 1.6 + Math.random() * 2
      const theta = Math.random() * Math.PI * 2
      const phi = (Math.random() - 0.3) * Math.PI * 1.2
      pArr[i*3]   = r * Math.cos(theta) * Math.cos(phi)
      pArr[i*3+1] = (Math.random() - 0.2) * 4
      pArr[i*3+2] = r * Math.sin(theta) * Math.cos(phi)
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3))
    const pMat = new THREE.PointsMaterial({ color: 0xc8a45a, size: 0.022, transparent: true, opacity: 0.55 })
    const particles = new THREE.Points(pGeo, pMat)
    group.add(particles)

    // Ground glow
    const glow = new THREE.Mesh(
      new THREE.CircleGeometry(2.2, 64),
      new THREE.MeshBasicMaterial({ color: 0x2d8a4e, transparent: true, opacity: 0.05, side: THREE.DoubleSide })
    )
    glow.rotation.x = -Math.PI / 2
    glow.position.y = -1.5
    group.add(glow)

    group.position.set(1.8, -0.5, 0)
    scene.add(group)

    // ── INTERACTION ───────────────────────────────────────
    let autoRot = 0
    let manualRot = 0
    let mouseX = 0, mouseY = 0
    let isDragging = false, prevX = 0

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const onMouseDown = (e) => { isDragging = true; prevX = e.clientX }
    const onMouseUp   = () => { isDragging = false }
    const onDrag = (e) => {
      if (isDragging) { manualRot += (e.clientX - prevX) * 0.009; prevX = e.clientX }
    }
    let prevTX = 0
    const onTouchStart = (e) => { prevTX = e.touches[0].clientX }
    const onTouchMove  = (e) => { manualRot += (e.touches[0].clientX - prevTX) * 0.012; prevTX = e.touches[0].clientX }

    window.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onDrag)
    canvas.addEventListener('touchstart', onTouchStart)
    canvas.addEventListener('touchmove', onTouchMove)

    // ── ANIMATE ───────────────────────────────────────────
    let t = 0
    let rafId

    // Store scroll progress reactively
    stateRef.current.scrollProgress = scrollProgress

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      t += 0.012
      autoRot += 0.003

      const sp = stateRef.current.scrollProgress

      // Camera pulls back + tilts on scroll
      camera.position.z = 6 + sp * 2.8
      camera.position.y = 0.4 - sp * 0.6
      camera.rotation.x = sp * 0.12

      // Mouse parallax
      camera.position.x += (1.8 + mouseX * 0.4 - camera.position.x) * 0.04

      // Rotation: auto + manual + scroll drives extra spin
      group.rotation.y = autoRot + manualRot + sp * Math.PI * 1.4

      // Float
      group.position.y = -0.5 + Math.sin(t * 0.45) * 0.07

      // Subtle skirt sway
      outerSkirt.rotation.y = Math.sin(t * 0.3) * 0.04
      innerSkirt.rotation.y = 0.4 + Math.sin(t * 0.35 + 0.5) * 0.06

      // Dupatta flutter
      dupatta.rotation.z = -0.15 + Math.sin(t * 0.6) * 0.04

      // Particle drift
      particles.rotation.y = t * 0.07
      pMat.opacity = 0.45 + Math.sin(t) * 0.1

      // Light colour pulse (mimics lehenga shimmer)
      greenLight.intensity = 0.5 + Math.sin(t * 1.2) * 0.15
      pinkLight.intensity  = 0.35 + Math.cos(t * 0.9) * 0.12

      // Embroidery glow
      goldMat.emissiveIntensity = 0.28 + Math.sin(t * 1.8) * 0.1
      embMat.emissiveIntensity  = 0.38 + Math.cos(t * 2.1) * 0.12

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const onResize = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      renderer.dispose()
      window.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onDrag)
      window.removeEventListener('resize', onResize)
    }
  }, []) // only mount once

  // Update scroll progress without re-mounting
  useEffect(() => {
    stateRef.current.scrollProgress = scrollProgress
  }, [scrollProgress])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}
