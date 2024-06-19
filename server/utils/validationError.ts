class ValidationError extends Error {
  status:number=400
  constructor(message:string) {
    super(message)
    this.name='ValidationError'
  }
}
export default ValidationError