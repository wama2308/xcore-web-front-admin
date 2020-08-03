const Country = use('App/Models/Country')

class CountryRepository {

  /**
   * Busca un país con su provincia y su distrito
   */
  async findCountry(branch) {
    const countriesFormat = await Country
      .where('_id', branch.country_id)
      .where('enabled', true)
      .with('provinces', (builder) => {
        builder.where('_id', branch.province_id)
        builder.where('enabled', true)
        builder.with('districts', (builder) => {
          builder.where('_id', branch.district_id)
          builder.where('enabled', true)
        })
      })
      .first()
      
    const data = countriesFormat.$relations.provinces.rows[0]
    const dataDistrict = data.$relations.districts.rows[0]
    const province = {
      'label': data.name,
      'value': data._id,
    }

    const district = {
      'label': dataDistrict.name,
      'value': dataDistrict._id,
    }

    const country = {
      'label': countriesFormat.name,
      'value': countriesFormat._id,
    }

    return {
      country,
      province,
      district
    }
  }

}

module.exports = new CountryRepository()