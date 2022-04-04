/* global AFRAME */
import { Reflector } from 'three/examples/jsm/objects/Reflector'

AFRAME.registerComponent('mirror', {
  schema: {
    color: { type: 'color', default: 0xffffff }
  },
  multiple: false,

  init: function () {
    const geometry = this.el.getObject3D('mesh').geometry
    this.el.object3D.visible = false

    const mirror = new Reflector(geometry, {
      clipBias: 0.003,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      color: this.data.color
    })

    mirror.position.y = 0.2
    mirror.rotation.x = -Math.PI / 2
    mirror.scale.set(4, 40, 1)
    this.el.sceneEl.object3D.add(mirror)
  }
})
