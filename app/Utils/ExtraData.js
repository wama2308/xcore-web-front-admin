class ExtraData {

  extraData(instance) {

    if (instance.discount) {
      let item = instance.discount
      instance.discount = {
        label: item.name,
        value: item._id,
        info: item
      }
    }

    if (instance.screens) {
      instance.screens = instance.screens.map(item => {
        return {
          label: item.name,
          value: item._id,
          info: {
            ...item
          }
        }
      })
    }

    if (instance.users) {
      instance.users = instance.users.map(item => {
        if ((item.pivot && item.pivot.rol && item.pivot.rol === 'maintenance')) {
          instance.responsible_maintenance = {
            label: `${item.username} | ${item.names} ${item.surnames} | ${item.email}`,
            value: item._id
          }
        }

        if ((item.pivot && item.pivot.rol && item.pivot.rol === 'manager')) {
          instance.manager = {
            label: `${item.username} | ${item.names} ${item.surnames} | ${item.email}`,
            value: item._id
          }
        }

        return {
          label: `${item.username} | ${item.names} ${item.surnames} | ${item.email}`,
          value: item._id,
          rol: (item.pivot && item.pivot.rol) ? item.pivot.rol : null
        }
      })

      instance.manager = (!instance.required_manager) ? null : instance.manager
      instance.responsible_maintenance = (!instance.required_maintenance) ? null : instance.responsible_maintenance
    }

    if (instance.schedule) {
      instance.schedule = {
        label: instance.schedule.name,
        value: instance.schedule._id,
        info: instance.schedule
      }
    }

    if (instance.goods) {
      instance.goods = instance.goods.map(item => {
        return {
          name: item.name,
          goods_id: item._id,
          quantity: (item.pivot && item.pivot.quantity) ? item.pivot.quantity : 0
        }
      })
    }

    if (instance.penalties) {
      instance.penalties = instance.penalties.map(item => {
        return {
          label: item.name,
          value: item._id,
          info: {
            '_id': item._id,
            'name': item.name,
            'description': item.description,
            'amount': item.amount
          }
        }
      })
    }

    if (instance.additional_day_array) {
      instance.additional_day_array = this.daysSelect(instance.additional_day_array)
    }

    if (instance.tax) {
      let item = instance.tax
      instance.tax = {
        label: item.amount,
        value: item._id,
      }
    }

    return instance
  }

  daysSelect(instance) {
    const data = [
      {
        "label": "Lunes",
        "value": "Monday"
      },
      {
        "label": "Martes",
        "value": "Tuesday"
      },
      {
        "label": "Miércoles",
        "value": "Wednesday"
      },
      {
        "label": "Jueves",
        "value": "Thursday"
      },
      {
        "label": "Viernes",
        "value": "Friday"
      },
      {
        "label": "Sábado",
        "value": "Saturday"
      },
      {
        "label": "Domingo",
        "value": "Sunday"
      }
    ]

    let array_return = []
    for (let day of instance) {
      data.find(dat => {
        if (dat.value === day) {
          array_return.push(dat)
        }
      })
    }

    return array_return
  }

}

module.exports = new ExtraData()