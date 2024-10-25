import nodemailer from 'nodemailer';
import mjml2html from 'mjml';

require('dotenv').config();

const transport = nodemailer.createTransport({
  service: "Gmail",
  // 발신자 인증 정보
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.NODEMAILER_KEY
  }
});

const userTo = process.env.ADMIN_EMAIL;
let contentMessage = "";

const setMailOption = (to: string, subject: string, text: string, contentMessage: string, fontSize: Number) => {
  const { html } = mjml2html(
    `
    <mjml>
  <mj-body>
    <mj-section padding="1px 0px">
      <mj-column>
        <mj-image src="https://ibb.co/XYcqM8b"></mj-image>
        <mj-spacer padding="5px 0px"></mj-spacer>
        <mj-text padding="7px 5px">
          <div style="text-align: center;">
            <span style="background-color: rgba(0, 0, 0, 0);">
              <font size="5" face="Comic Sans MS" color="#000000">${subject}</font>
            </span>
          </div>
          <div style="text-align: center;">
            <span style="background-color: rgba(0, 0, 0, 0);">
              </br></br></br>
              <font size="4" color="#000000">회원가입을 위한 이메일 인증번호입니다.</font></br>
              <font size="4" color="#000000">인증번호를 인증번호 입력창에 입력해주세요.</font>
            </span>
          </div>
        </mj-text>
        <mj-text padding="7px 5px">
          <div style="text-align: center;">
            <span style="background-color: rgba(0, 0, 0, 0); color: #6d987a;">
              <font size="5" face="Comic Sans MS ">${text} : </font>
            </span>
          </div>
          <div style="text-align: center;">
            <span style="background-color: rgba(0, 0, 0, 0);">
              <font size="5" face="Comic Sans MS">${contentMessage}</font>
            </span>
          </div>
        </mj-text>
        <mj-text padding="14px 10px">
          <div style="text-align: center;">
            <span style="background-color: rgba(0, 0, 0, 0);">
              <font size="4" face="Comic Sans MS">케어버디와 함께 사랑하는 나의 반려동물과 건강하고 행복한 시간을 보내세요.</font>
            </span>
          </div>
        </mj-text>
        <mj-spacer padding="1px 0px"></mj-spacer>
        <mj-text padding="0px 1px">
          <div style="text-align: center;">
            <span>&nbsp;</span>
            <span style="background-color: rgba(0, 0, 0, 0); font-size: 12px; white-space: pre; color: #6d987a;">https://carebuddy.vercel.app/</span>
          </div>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
    `
  );

  new Promise((resolve, reject) => {
    const message = { from: userTo, to, subject, text, html: html };

    transport.sendMail(message, (err, info) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(info);
    });
  });
};

export default setMailOption;