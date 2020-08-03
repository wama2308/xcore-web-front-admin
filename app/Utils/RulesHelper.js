module.exports = function rule(_id) {
  const rul = await rulRepository.findOneRule(_id)

  return rul
}
