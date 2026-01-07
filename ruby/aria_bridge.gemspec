Gem::Specification.new do |s|
  s.name        = 'aria-bridge'
  s.version     = '0.0.1'
  s.summary     = 'Minimal Ruby client for Aria Bridge protocol v2'
  s.description = s.summary
  s.author      = 'Aria Bridge'
  s.email       = 'opensource@just.every'
  s.files       = Dir['lib/**/*.rb']
  s.homepage    = 'https://github.com/shaneholloman/aria-bridge'
  s.license     = 'MIT'
  s.required_ruby_version = '>= 3.0'
  s.add_dependency 'websocket-client-simple', '~> 0.6'
end
