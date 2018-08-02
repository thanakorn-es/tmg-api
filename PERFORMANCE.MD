 curl -k --request POST --header 'accept: application/json' --header 'Content-Type: application/json' --header 'x-ibm-client-id: d2014527-2f56-43a5-a718-8bc20a4ced8c' --header 'X-ibm-client-secret: Y1nM7pN5aK1xH1xP5bP4dQ1rO1hU2nI2fV3sA1bN0cF2dR2uY7' --data '{"CUST_ID":"3001598793505"}' https://49.231.171.163/scb/sb/validateid




   "X-ibm-Client-id": "feed1a1d-7272-4459-a51b-18699fe6b581",
                                "X-ibm-Client-secret": "E3dN1wF7xW8vN2yO4fH0qN6dW0nI6rB0cX7oR2hE5aR1uR6tI8"


"tls": {
                        "rejectUnauthorized": false
                },



                curl -k --request POST \
  --url https://mds.themall.co.th/scb/cobrand/validateID \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --header 'x-ibm-client-id: d2014527-2f56-43a5-a718-8bc20a4ced8c' \
  --header 'X-ibm-client-secret: Y1nM7pN5aK1xH1xP5bP4dQ1rO1hU2nI2fV3sA1bN0cF2dR2uY7' \
  --data '{"CUST_ID":"3001598793505"}'