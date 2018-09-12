const express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
//parse applicaion json
//databases
const { insertNewUser,
        filterUserByName,
        updateAnUser,
        insertAddressToUser,
        deleteUser
 } = require('../database/realmSchemas')
app.get('/', (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.send({
        status: "success",
        name: "Hoatpro",
        sms: "This is root path for Realm Nodejs project"
    })
});
//Filter users by name
app.get('/filter_users_by_name', (request, response) => {
    const { searchedName } = request.query
    filterUserByName(searchedName).then(filteredUsers => {
        response.send({
            status: "Success",
            message: `Filtered users with name:'${searchedName}' successfully`,
            data: filteredUsers,
            numberOfObject:filteredUsers.length
        })
    }).catch((error) => {
        response.send({
            status: "failed",
            message:`Filtered users with name :${searchedName} error .Erros is:${error}`
         })
    })
})
app.post('/insert_new_user', (request, response) => {
    const { tokenkey } = request.headers
    const { name, email } = request.body
    response.setHeader('Content-Type', 'application/json')
    if (tokenkey != 'abc123456789') {
        response.send({
            status: "failed",
            message:"You sent wrong token's key"
        });
        return;
    }
    insertNewUser({ name, email })
      .then(insertedUser => {
        response.send({
          status: "success",
          message: "Insert new User successfully",
          data: insertedUser
        });
      })
        .catch(error => {
            response.send({
                status: "failed",
                message: `Insert User error :${error}`,
            });
      });

});
app.post('/insert_address_to_user', (request, response) => {
    console.log(`tokenkey=${JSON.stringify(request.headers.tokenkey)}`);
    const { tokenkey } = request.headers;
    const { userId, street, city, state } = request.body;
    console.log(`request.body=${JSON.stringify(request.body)}`);
    response.setHeader('Content-Type', 'application/json');
    if (tokenkey != 'abc123456789') {
        response.send({
            status: 'failed',
            message:"You sent wrong token's key"
        })
        return
    }
    insertAddressToUser(Number(userId) == NaN ? 0 : Number(userId), { street, city, state }).then(insertedAddress => {
        response.send({
            status: "Success",
            message: `Insert address to user with UserID='${userId}'successfully!`,
            data:insertedAddress

           })
    }).catch((error) => {
        response.send({
            status: "failed",
            message:`Insert address to user error.Error is :${error}`
           })
    })
})
app.put('/update_user', (request, response) => {
    const { tokenkey } = request.headers
    const { userId, name, email } = request.body
    response.setHeader('Content-Type', 'application/json')
    if (tokenkey != 'abc123456789') {
        response.send({
            status: "failed",
            message: "You sent wrong token's key"
        });
         return
    }
    updateAnUser(Number(userId) == NaN ? 0 : Number(userId), { name, email }).then(updatedUser => {
        response.send({
            status: "Success",
            message: "Update User successfully",
            data:updatedUser
        })
    }).catch((error) => {
        response.send({
            status: "failed",
            message:`Update User is error .Error is ${error}`
         })
    })
})
//Delete user
app.delete('/delete_user', (request, response) => {
    const { tokenkey } = request.headers;
    const { userId } = request.body;
    response.setHeader('Content-Type', 'application/json');
    if (tokenkey != 'abc123456789') {
        response.send({
            status: "failed",
            message:"You send wrong tonken's key!"
        })
        return
    }
    deleteUser(Number(userId) == NaN ? 0 : Number(userId)).then(()=> {
        response.send({
            status: "Success",
            message: `Delete user with UserId='${userId}' successfully!`
        });
        return
    }).catch((error) => {
        response.send({
            status: "failed",
            message: `Delete user is error .Erros :${error}`
        })
     })
})
module.exports = {
    app
}