// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "AriaBridgeClient",
    platforms: [.iOS(.v14), .macOS(.v12)],
    products: [
        .library(name: "AriaBridgeClient", targets: ["AriaBridgeClient"]),
        .executable(name: "AriaBridgeExample", targets: ["AriaBridgeExample"])
    ],
    targets: [
        .target(name: "AriaBridgeClient"),
        .executableTarget(name: "AriaBridgeExample", dependencies: ["AriaBridgeClient"]),
        .testTarget(
            name: "AriaBridgeClientTests",
            dependencies: ["AriaBridgeClient"]
        )
    ]
)
