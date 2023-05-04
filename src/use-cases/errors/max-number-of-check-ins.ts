export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super('Max number of check ins.')
    this.name = 'MaxNumberOCheckIns'
  }
}
