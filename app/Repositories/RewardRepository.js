const BranchOffice = use('App/Models/BranchOffice')
const Reward = use('App/Models/Reward')
const regexHelper = use('App/Utils/RegexHelper')
const paginatorHelper = use('App/Utils/PaginatorHelper')

class RewardRepository {

  async datatable(request, enabled = true) {
    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))
    let { search } = request.only(['search'])
    let { page, perPage } = new paginatorHelper(request.get().page, request.get().perPage)

    const query = branchOffice.rewards().query()
      .where(function () {
        this.where('enabled', enabled)
      })

    if (search) {
      search = new regexHelper(search)
      query.where(function () {
        this.where({
          $or: [
            { name: { $regex: search } },
            { description: { $regex: search } }
          ]
        })
      })
    }

    return await query.paginate(page, perPage)
  }

  async findOneReward(branch_id, reward_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const reward = await branchOffice.rewards()
      .where('_id', reward_id)
      .where('enabled', true)
      .with('discount')
      .with('classes')
      .with('services')
      .with('packages')
      .with('plans')
      .with('products')
      .first()

    if (!reward) {
      throw new exception(
        'Recompensa no encontrada',
      )
    }

    return reward
  }

  async findAllReward(branch_id, enabled) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const rewards = await branchOffice.rewards()
      .where('enabled', enabled)
      .fetch()

    return rewards
  }

  async findOneRewardWithoutStatus(branch_id, reward_id) {
    const branchOffice = await BranchOffice.findOrFail(branch_id)
    const reward = await branchOffice.rewards()
      .where('_id', reward_id)
      .first()

    if (!reward) {
      throw new exception(
        'Recompensa no encontrada',
      )
    }

    return reward
  }

}

module.exports = new RewardRepository()