def optimize_signal(lanes):

    ns = lanes["north"] + lanes["south"]
    ew = lanes["east"] + lanes["west"]

    if ns > ew:
        return {
            "phase": "NS_GREEN",
            "duration": 45
        }

    return {
        "phase": "EW_GREEN",
        "duration": 45
    }