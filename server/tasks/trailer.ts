// 爬取视频源

import * as cp from 'child_process'
import { resolve } from 'path'

;(async () => {
    const script :string = resolve(__dirname, "../crawler/video")
    // fork一个子进程
    const child = cp.fork(script, [])
    let invoked :boolean = false

    child.on('error', (err :Error) => {
        if (invoked) return
        invoked = true

        console.log(err)
    })

    child.on('exit', code => {
        if (invoked) return
        invoked = true
        let err = code === 0 ? null : new Error('exit code ' + code)

        if (err) {
            console.log(err)
        }
       
    })

    child.on('message', data => {
        console.log(data)
    })

})()