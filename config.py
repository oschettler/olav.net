# ------------------------------------------------------------------------------
# Site Configuration File
# ------------------------------------------------------------------------------

# Choose the theme to use when building your site. This variable should specify
# the name of a theme directory in your site's 'lib' folder.
theme = "carbon"

title = "olav.net"

tagline = "digitalisierung. bildung. gesellschaft."

extensions = ['holly']

holly = {
    "roots": [
        {"root_url": "@root/blog//"},
    ],
    "homepage": {
        "root_urls": ["@root/blog//"],
    }
}

