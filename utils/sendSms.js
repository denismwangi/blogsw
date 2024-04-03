const africastalking = require('africastalking');

const sendSms = async (phone,message) => {

    const AfricasTalking = new africastalking({
        apiKey: process.env.SMS_API_KEY,
        username: process.env.SMS_USERNAME
      }, {debug: true});
      
      const sms = AfricasTalking.SMS;

      sms.send({to: phone, message})
      .then(success => console.log({message: message, to: phone}))
      .catch(error => console.log(error));

}

module.exports = sendSms;
