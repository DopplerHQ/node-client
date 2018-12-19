workflow "Publish" {
  on = "push"
  resolves = ["NPM Publish"]
}

action "NPM Publish" {
  uses = "actions/npm@c555744"
  secrets = ["NPM_AUTH_TOKEN"]
  runs = "publish --access public"
}
