FROM  stripe/stripe-cli
RUN  apk  add  pass  gpg-agent
COPY  ./entrypoint.sh  /entrypoint.sh
ENTRYPOINT  [ "/entrypoint.sh" ]
CMD ["listen", "--skip-verify", "--api-key", "sk_test_51PVBspLDBaFPKLdsGGFoEZyChBZXVVRRiXMALYUYkambWs5PtI1ggasJt0qaD3Rlj3c8XZJ85DvABSOgwPrODGVG00nrVuuIfF", "--forward-to" ,"http://backend/stripe/webhook", "--log-level", "error"]