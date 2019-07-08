function link(parent, args, context) {
  console.log(parent.id);
  return context.prisma.vote({ id: parent.id }).link();
}

function user(parent, args, context) {
  console.log(parent.id);
  return context.prisma.vote({ id: parent.id }).user();
}

module.exports = {
  link,
  user
};
