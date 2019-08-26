FROM registry.gitlab.com/cmc-ts/cts-service-server/api-service-base:1.0
MAINTAINER Slowlove

COPY . /var/server
EXPOSE 22 3001

WORKDIR /var/server
ENTRYPOINT ["bash"]
CMD ["start.sh"]
