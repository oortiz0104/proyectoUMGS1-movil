const apiRoutes = {
  user: {
    login: "/user/login",
    update: "/user/update",
    delete: "/user/delete",
    getUsers: "/user/getUsers",
    register_OnlyAdmin: "/user/register_OnlyAdmin",
    update_OnlyAdmin: "/user/update_OnlyAdmin",
    delete_OnlyAdmin: "/user/delete_OnlyAdmin",
  },
  newPC: {
    checkIn: "newPC/checkIn",
    checkOut: "newPC/checkOut",
    getNewPCs: "newPC/getNewPCs",
    updateNewPC: "newPC/updateNewPC",
    deleteNewPC: "newPC/deleteNewPC",
  },
  usedPC: {
    checkIn: "usedPC/checkIn",
    checkOut: "usedPC/checkOut",
    getUsedPCs: "usedPC/getUsedPCs",
    updateUsedPC: "usedPC/updateUsedPC",
    deleteUsedPC: "usedPC/deleteUsedPC",
  },
  newPCRegister: {
    getNewPCsRegister: "newPCRegister/getNewPCsRegister",
  },
  usedPCRegister: {
    getUsedPCsRegister: "usedPCRegister/getUsedPCsRegister",
  },
  cellar: {
    add: "cellar/add",
    getNotOccupiedCellarUbications: "cellar/getNotOccupiedCellarUbications",
    getCellarUbications: "cellar/getCellarUbications",
    updateCellarUbication: "cellar/updateCellarUbication",
    deleteCellarUbication: "cellar/deleteCellarUbication",
  },
}

export default apiRoutes
