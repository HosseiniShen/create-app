const { hasProjectYarn } = require('./utils/env')

class PackageManager {
  constructor (context, pm) {
    this.context = context

    if (pm) {
      this.bin = pm
    } else if (context) {
      this.bin = hasProjectYarn(context) ? 'yarn' : 'npm'
    }
  }

  executeCommand () {
    
  }
}