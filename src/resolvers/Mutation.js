const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

function post(root, args, context) {
  const userId = getUserId(context);
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  });
}

async function vote(parent, args, context, info) {
  const userId = getUserId(context);
  const linkexist = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId }
  });
  if (linkexist) {
    throw new Error(`Already vote for link: ${args.linkId}`);
  }
  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } }
  });
}

async function login(root, args, context) {
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error("No User Found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid Password");
  }
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user
  };
}

async function signup(root, args, context) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.createUser({ ...args, password });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user
  };
}

module.exports = {
  post,
  signup,
  login,
  vote
};
