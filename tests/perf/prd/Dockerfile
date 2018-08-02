FROM ubuntu:16.04
RUN apt-get update && apt-get install -y \
    nodejs \
    npm

RUN npm install --global artillery
RUN mkdir /test
RUN echo "Copying Configuration...."
COPY inquiry.partner.1.json /test
RUN cd /test
RUN echo "Running Load Test...."
WORKDIR /test
ENTRYPOINT ['/test']



