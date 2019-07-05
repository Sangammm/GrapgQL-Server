function links(parents, args, context) {
  return context.prisma.user({ id: parent.id }).links();
}

module.exports = {
  links
};
