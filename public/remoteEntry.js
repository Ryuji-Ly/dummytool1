// Module Federation Remote Entry for dummytool1
// This version exposes the entire page, not just a component
(function () {
    console.log("[dummytool1] Initializing remote entry for full page loading...");

    const loadFullPage = async () => {
        try {
            console.log("[dummytool1] Loading full page...");

            // Fetch the page HTML
            const response = await fetch("https://dummytool1.duckdns.org/");
            if (!response.ok) {
                throw new Error(`Failed to fetch page: ${response.status}`);
            }

            const html = await response.text();

            // Parse the HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Create a component that renders the full page
            const FullPageComponent = function () {
                const containerRef = React.useRef(null);
                const [mounted, setMounted] = React.useState(false);

                React.useEffect(() => {
                    if (!containerRef.current || mounted) return;

                    // Get all the content from body
                    const bodyContent = doc.body.innerHTML;

                    // Inject the content
                    containerRef.current.innerHTML = bodyContent;

                    // Find and execute scripts
                    const scripts = doc.querySelectorAll("script");
                    scripts.forEach((script) => {
                        const newScript = document.createElement("script");
                        if (script.src) {
                            // Handle external scripts
                            newScript.src = script.src;
                            newScript.async = false;
                        } else {
                            // Handle inline scripts
                            newScript.textContent = script.textContent;
                        }
                        containerRef.current.appendChild(newScript);
                    });

                    // Inject styles
                    const styles = doc.querySelectorAll('style, link[rel="stylesheet"]');
                    styles.forEach((style) => {
                        if (style.tagName === "LINK") {
                            const link = document.createElement("link");
                            link.rel = "stylesheet";
                            link.href = style.href;
                            document.head.appendChild(link);
                        } else {
                            const styleEl = document.createElement("style");
                            styleEl.textContent = style.textContent;
                            document.head.appendChild(styleEl);
                        }
                    });

                    setMounted(true);
                    console.log("[dummytool1] Full page injected successfully");
                }, [mounted]);

                return React.createElement("div", {
                    ref: containerRef,
                    className: "dummytool1-page-container",
                    style: { minHeight: "400px", width: "100%" },
                });
            };

            console.log("[dummytool1] Full page component ready");
            return { default: FullPageComponent };
        } catch (error) {
            console.error("[dummytool1] Error loading full page:", error);

            // Return an error component
            return {
                default: function () {
                    return React.createElement(
                        "div",
                        {
                            className: "p-4 bg-red-50 border border-red-200 rounded text-red-700",
                        },
                        [
                            React.createElement(
                                "p",
                                { key: "error", className: "font-semibold" },
                                "Failed to load dummytool1 page: " + error.message
                            ),
                        ]
                    );
                },
            };
        }
    };

    const moduleMap = {
        "./Component": loadFullPage,
        "./Page": loadFullPage, // Alias for clarity
    };

    const get = (module) => {
        console.log(`[dummytool1] get() called for module: ${module}`);
        return moduleMap[module]
            ? moduleMap[module]()
            : Promise.reject(new Error(`Module ${module} not found in dummytool1`));
    };

    const init = (shareScope) => {
        console.log("[dummytool1] init() called with shareScope:", shareScope);
        if (!window.__federation_shared__) {
            window.__federation_shared__ = shareScope || {};
        }
        return Promise.resolve();
    };

    // Register the container globally
    if (!window.dummytool1) {
        window.dummytool1 = {
            get,
            init,
        };
        console.log("[dummytool1] Container registered globally (full page mode)");
    }
})();
