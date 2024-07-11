<?php

namespace App;

class Application extends \Illuminate\Foundation\Application
{
    /**
     * {@inheritdoc}
     */
    public function flush(): void
    {
        $this->aliases = [];
        $this->resolved = [];
        $this->bindings = [];
        $this->abstractAliases = [];
        $this->scopedInstances = [];
    }
}