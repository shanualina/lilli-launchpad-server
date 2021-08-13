let users = [];
function joinUser(socketId, USERNAME, ROOMNAME, TYPE='call',detail={}) {
  const user = {
    socketID: socketId,
    USERNAME: USERNAME,
    ROOMNAME: ROOMNAME,
    TYPE: TYPE,
    detail:detail
  }
  users.push(user);
  return user;
}
function getUsers() {
  return users;
}

function findUser(id) {
  return users.find((user) => {
    user.socketID === id;
  })
}

function removeUser(id) {
  const getID = users => users.socketID === id;
  const index = users.findIndex(getID);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }

}

//call inilize
let calls = [];
function joinCall(socketId, ROOM_ID) {
  const call = {
    socketID: socketId,
    ROOM_ID: ROOM_ID
  }
  calls.push(call);
  return call;
}
//find call join
function findCall(id) {
  return calls.find((call) => {
    call.id === id;
  })
}
//call end room disconnect
function endCall(id) {
  const getID = calls => calls.socketID === id;
  const index = calls.findIndex(getID);
  if (index !== -1) {
    return calls.splice(index, 1)[0];
  }

}
module.exports = { joinUser, removeUser, findUser,joinCall,findCall,endCall, getUsers}