const animTexComponent = {
    schema: {
        offsetVal: { type: 'number', default: 0.06 },
    },
    init() {
        this.offset = 0
        this.offsetVal = this.data.offsetVal
        //console.log(this.offsetVal)
    },
    tick() {
        const mesh = this.el.getObject3D('mesh')
        if (!mesh) {
            return
        }
        mesh.traverse((node) => {
            if (node.isMesh) {
                node.material.map.offset.y = this.offset
                node.material.needsUpdate = true
            }
        })
        this.offset += this.offsetVal
        //  console.log(this.offset)
    },
}
export { animTexComponent }
