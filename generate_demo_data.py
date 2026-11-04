#!/usr/bin/env python3
"""
AquaSafe - Demonstration & Seed Data Generator for Tamil Nadu Districts
Calls seed_tamilnadu_data.py to generate authentic multi-source surveillance datasets.
"""
import subprocess
import sys
import os

if __name__ == "__main__":
    script = os.path.join(os.path.dirname(__file__), "seed_tamilnadu_data.py")
    result = subprocess.run([sys.executable, script])
    sys.exit(result.returncode)
