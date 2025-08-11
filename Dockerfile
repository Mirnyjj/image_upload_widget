FROM node:lts as dependencies
WORKDIR /image_upload_widget
COPY package.json ./
RUN yarn install --frozen-lockfile

FROM node:lts as builder
WORKDIR /image_upload_widget
COPY . .
COPY --from=dependencies /image_upload_widget/node_modules ./node_modules
RUN yarn build

FROM node:lts as runner
WORKDIR /image_upload_widget
ENV NODE_ENV production

# COPY --from=builder /image_upload_widget/public ./public
COPY --from=builder /image_upload_widget/package.json ./package.json
COPY --from=builder /image_upload_widget/.next ./.next
COPY --from=builder /image_upload_widget/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]